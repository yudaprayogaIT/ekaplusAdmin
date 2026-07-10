module.exports = [
"[project]/src/components/branch_customer/BCContactRelationsPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BCContactRelationsPanel",
    ()=>BCContactRelationsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ConfirmDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ConfirmDialog.tsx [app-ssr] (ecmascript)");
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
function toNumber(value) {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    if (value && typeof value === "object" && "id" in value) {
        return toNumber(value.id);
    }
    return 0;
}
function mapContact(row) {
    return {
        id: toNumber(row.id),
        name: row.name || undefined,
        full_name: row.full_name || row.name || "-",
        display_name: row.display_name || undefined,
        disabled: Number(row.disabled || 0)
    };
}
function mapPosition(row) {
    return {
        id: toNumber(row.id),
        name: row.name || undefined,
        position_name: row.position_name || row.name || "-",
        disabled: Number(row.disabled || 0)
    };
}
function mapRelation(row) {
    return {
        id: toNumber(row.id),
        name: row.name || undefined,
        parent_id: toNumber(row.parent_id),
        parent_type: row.parent_type || "branch_customer",
        contact_id: toNumber(row.contact_id),
        position_id: toNumber(row.position_id),
        title: row.title || undefined,
        is_primary: Number(row.is_primary || 0),
        created_at: row.created_at || undefined,
        updated_at: row.updated_at || undefined
    };
}
function mapIdentity(row) {
    return {
        id: toNumber(row.id),
        contact_id: toNumber(row.contact_id),
        channel: row.channel || "",
        handle: row.handle || "",
        external_id: row.external_id || undefined,
        is_verified: Number(row.is_verified || 0)
    };
}
function RelationFormModal({ open, onClose, initial, onSubmit, saving, error, contacts, positions }) {
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        contact_id: "",
        position_id: "",
        title: "",
        is_primary: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        setDraft({
            id: initial?.id,
            contact_id: initial?.contact_id ? String(initial.contact_id) : "",
            position_id: initial?.position_id ? String(initial.position_id) : "",
            title: initial?.title || "",
            is_primary: Number(initial?.is_primary || 0) === 1
        });
    }, [
        initial,
        open
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            exit: {
                opacity: 0
            },
            className: "fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/60 p-4",
            onClick: (event)=>{
                if (event.target === event.currentTarget && !saving) onClose();
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].form, {
                initial: {
                    opacity: 0,
                    y: 24,
                    scale: 0.98
                },
                animate: {
                    opacity: 1,
                    y: 0,
                    scale: 1
                },
                exit: {
                    opacity: 0,
                    y: 12,
                    scale: 0.98
                },
                onSubmit: async (event)=>{
                    event.preventDefault();
                    await onSubmit(draft);
                },
                className: "w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_55%),linear-gradient(135deg,#eff6ff,#ffffff_55%,#f8fafc)] px-6 py-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-bold uppercase tracking-[0.28em] text-blue-700",
                                children: "Branch Contact Relation"
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 193,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "mt-2 text-2xl font-bold text-slate-900",
                                children: initial ? "Edit Relasi Contact" : "Tambah Relasi Contact"
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 196,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                        lineNumber: 192,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-5 p-6",
                        children: [
                            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 203,
                                columnNumber: 17
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-semibold text-slate-700",
                                        children: "Contact"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 209,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: draft.contact_id,
                                        onChange: (event)=>setDraft((prev)=>({
                                                    ...prev,
                                                    contact_id: event.target.value
                                                })),
                                        className: "w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500",
                                        disabled: saving,
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Pilih contact"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 219,
                                                columnNumber: 19
                                            }, this),
                                            contacts.map((contact)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: String(contact.id),
                                                    children: [
                                                        contact.full_name,
                                                        contact.display_name ? ` (${contact.display_name})` : ""
                                                    ]
                                                }, contact.id, true, {
                                                    fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                    lineNumber: 221,
                                                    columnNumber: 21
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 210,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 208,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-semibold text-slate-700",
                                        children: "Position"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 230,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: draft.position_id,
                                        onChange: (event)=>setDraft((prev)=>({
                                                    ...prev,
                                                    position_id: event.target.value
                                                })),
                                        className: "w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500",
                                        disabled: saving,
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Pilih position"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 240,
                                                columnNumber: 19
                                            }, this),
                                            positions.map((position)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: String(position.id),
                                                    children: position.position_name
                                                }, position.id, false, {
                                                    fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                    lineNumber: 242,
                                                    columnNumber: 21
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 231,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 229,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-semibold text-slate-700",
                                        children: "Title"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 250,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: draft.title,
                                        onChange: (event)=>setDraft((prev)=>({
                                                    ...prev,
                                                    title: event.target.value
                                                })),
                                        className: "w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500",
                                        disabled: saving,
                                        placeholder: "Contoh: PIC Purchasing, Decision Maker"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 251,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 249,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: draft.is_primary,
                                        onChange: (event)=>setDraft((prev)=>({
                                                    ...prev,
                                                    is_primary: event.target.checked
                                                })),
                                        disabled: saving
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 263,
                                        columnNumber: 17
                                    }, this),
                                    "Jadikan primary contact"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 262,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                        lineNumber: 201,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between border-t border-slate-200 px-6 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onClose,
                                disabled: saving,
                                className: "px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900",
                                children: "Batal"
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 276,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: saving,
                                className: "rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60",
                                children: saving ? "Menyimpan..." : initial ? "Update Relasi" : "Simpan Relasi"
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 284,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                        lineNumber: 275,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                lineNumber: 182,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
            lineNumber: 173,
            columnNumber: 9
        }, this) : null
    }, void 0, false, {
        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
function BCContactRelationsPanel({ branchCustomerId }) {
    const { token, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [contacts, setContacts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [positions, setPositions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [identities, setIdentities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [relations, setRelations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modalInitial, setModalInitial] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [modalError, setModalError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmOpen, setConfirmOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const actionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const loadData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!isAuthenticated || !token || !branchCustomerId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const headers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeaders"])(token);
            const [relationRows, contactRows, positionRows] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
                    endpoint: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_CONTACT,
                    spec: {
                        fields: [
                            "*"
                        ],
                        filters: [
                            [
                                "parent_type",
                                "=",
                                "branch_customer"
                            ],
                            [
                                "parent_id",
                                "=",
                                branchCustomerId
                            ]
                        ]
                    },
                    token,
                    requestInit: {
                        headers
                    },
                    errorMessage: "Gagal memuat relasi contact"
                }),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
                    endpoint: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CONTACT,
                    spec: {
                        fields: [
                            "id",
                            "name",
                            "full_name",
                            "display_name",
                            "disabled"
                        ]
                    },
                    token,
                    requestInit: {
                        headers
                    },
                    errorMessage: "Gagal memuat contact lookup"
                }),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
                    endpoint: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_POSITION,
                    spec: {
                        fields: [
                            "id",
                            "name",
                            "position_name",
                            "disabled"
                        ]
                    },
                    token,
                    requestInit: {
                        headers
                    },
                    errorMessage: "Gagal memuat position lookup"
                })
            ]);
            const mappedRelations = (Array.isArray(relationRows) ? relationRows : []).map(mapRelation);
            const relatedContactIds = Array.from(new Set(mappedRelations.map((item)=>item.contact_id).filter(Boolean)));
            let mappedIdentities = [];
            if (relatedContactIds.length > 0) {
                const identityRows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
                    endpoint: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CONTACT_IDENTITIES,
                    spec: {
                        fields: [
                            "*"
                        ],
                        filters: [
                            [
                                "contact_id",
                                "in",
                                relatedContactIds
                            ]
                        ]
                    },
                    token,
                    requestInit: {
                        headers
                    },
                    errorMessage: "Gagal memuat contact identities"
                });
                mappedIdentities = identityRows.map(mapIdentity);
            }
            setRelations(mappedRelations);
            setContacts(contactRows.map(mapContact));
            setPositions(positionRows.map(mapPosition));
            setIdentities(mappedIdentities);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : String(loadError));
        } finally{
            setLoading(false);
        }
    }, [
        branchCustomerId,
        isAuthenticated,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void loadData();
    }, [
        loadData
    ]);
    const hydratedRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const contactMap = new Map(contacts.map((contact)=>[
                contact.id,
                contact
            ]));
        const positionMap = new Map(positions.map((position)=>[
                position.id,
                position
            ]));
        const identityMap = new Map();
        identities.forEach((identity)=>{
            const current = identityMap.get(identity.contact_id) || [];
            current.push(identity);
            identityMap.set(identity.contact_id, current);
        });
        return [
            ...relations
        ].map((relation)=>({
                ...relation,
                contact: contactMap.get(relation.contact_id),
                position: positionMap.get(relation.position_id),
                identities: identityMap.get(relation.contact_id) || []
            })).sort((a, b)=>{
            const primaryDiff = Number(b.is_primary || 0) - Number(a.is_primary || 0);
            if (primaryDiff !== 0) return primaryDiff;
            return (a.contact?.full_name || "").localeCompare(b.contact?.full_name || "");
        });
    }, [
        contacts,
        identities,
        positions,
        relations
    ]);
    const submitRelation = async (payload)=>{
        if (!token) return;
        setSaving(true);
        setModalError(null);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])(payload.id ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResourceUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_CONTACT, payload.id) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResourceUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_CONTACT), {
                method: payload.id ? "PUT" : "POST",
                headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeaders"])(token),
                body: JSON.stringify({
                    parent_type: "branch_customer",
                    parent_id: branchCustomerId,
                    contact_id: Number(payload.contact_id),
                    position_id: Number(payload.position_id),
                    title: payload.title.trim() || null,
                    is_primary: payload.is_primary ? 1 : 0
                })
            }, token);
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.message || `Gagal menyimpan relasi contact (${response.status})`);
            }
            setModalOpen(false);
            setModalInitial(null);
            await loadData();
        } catch (submitError) {
            setModalError(submitError instanceof Error ? submitError.message : String(submitError));
        } finally{
            setSaving(false);
        }
    };
    const deleteRelation = (item)=>{
        if (!token) return;
        actionRef.current = async ()=>{
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResourceUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_CONTACT, item.id), {
                method: "DELETE",
                headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeaders"])(token)
            }, token);
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.message || `Gagal menghapus relasi contact (${response.status})`);
            }
            await loadData();
        };
        setConfirmOpen(true);
    };
    const activeContacts = contacts.filter((contact)=>Number(contact.disabled || 0) !== 1);
    const activePositions = positions.filter((position)=>Number(position.disabled || 0) !== 1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaAddressBook"], {
                                    className: "text-lg"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                    lineNumber: 497,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 496,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] font-bold uppercase tracking-[0.24em] text-blue-700",
                                        children: "Contact Relation"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 500,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-2xl font-bold text-slate-900",
                                        children: "Customer Contacts"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 503,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 499,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                        lineNumber: 495,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>{
                            setModalError(null);
                            setModalInitial(null);
                            setModalOpen(true);
                        },
                        className: "inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPlus"], {
                                className: "text-xs"
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 516,
                                columnNumber: 11
                            }, this),
                            "Tambah Contact Relation"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                        lineNumber: 507,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                lineNumber: 494,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                lineNumber: 522,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-5 grid gap-4 md:grid-cols-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500",
                                children: "Related Contact"
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 529,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-2xl font-bold text-slate-900",
                                children: relations.length
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 532,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                        lineNumber: 528,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500",
                                children: "Primary Contact"
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 535,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-2xl font-bold text-slate-900",
                                children: relations.filter((item)=>Number(item.is_primary || 0) === 1).length
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 538,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                        lineNumber: 534,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500",
                                children: "Available Lookup"
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 543,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-base font-semibold text-slate-900",
                                children: [
                                    activeContacts.length,
                                    " contact / ",
                                    activePositions.length,
                                    " position"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 546,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                        lineNumber: 542,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                lineNumber: 527,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500",
                children: "Memuat relasi contact..."
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                lineNumber: 553,
                columnNumber: 9
            }, this) : hydratedRelations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUserTie"], {
                        className: "mx-auto text-3xl text-slate-300"
                    }, void 0, false, {
                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                        lineNumber: 558,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-lg font-semibold text-slate-700",
                        children: "Belum ada contact relation"
                    }, void 0, false, {
                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                        lineNumber: 559,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-slate-500",
                        children: "Tambahkan contact master yang relevan lalu hubungkan ke branch customer ini."
                    }, void 0, false, {
                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                        lineNumber: 562,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                lineNumber: 557,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: hydratedRelations.map((relation)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `rounded-[24px] border p-5 shadow-sm ${Number(relation.is_primary || 0) === 1 ? "border-blue-200 bg-blue-50/50" : "border-slate-200 bg-white"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-lg font-bold text-slate-900",
                                                        children: relation.contact?.full_name || `Contact #${relation.contact_id}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                        lineNumber: 580,
                                                        columnNumber: 21
                                                    }, this),
                                                    Number(relation.is_primary || 0) === 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaCheckCircle"], {
                                                                className: "text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                                lineNumber: 585,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Primary"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                        lineNumber: 584,
                                                        columnNumber: 23
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 579,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm text-slate-500",
                                                children: relation.contact?.display_name || relation.title || "-"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 590,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 578,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setModalError(null);
                                                    setModalInitial(relation);
                                                    setModalOpen(true);
                                                },
                                                className: "rounded-xl border border-blue-200 p-2 text-blue-700 hover:bg-blue-50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaEdit"], {
                                                    className: "text-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                    lineNumber: 605,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 596,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>deleteRelation(relation),
                                                className: "rounded-xl border border-rose-200 p-2 text-rose-700 hover:bg-rose-50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTrash"], {
                                                    className: "text-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                    lineNumber: 612,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 607,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 595,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 577,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-2xl border border-slate-200 bg-white px-4 py-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-slate-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaIdBadge"], {
                                                        className: "text-xs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                        lineNumber: 620,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[11px] font-bold uppercase tracking-[0.24em]",
                                                        children: "Position"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                        lineNumber: 621,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 619,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-2 text-sm font-semibold text-slate-900",
                                                children: relation.position?.position_name || `Position #${relation.position_id}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 625,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 618,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-2xl border border-slate-200 bg-white px-4 py-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500",
                                                children: "Title"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 630,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-2 text-sm text-slate-700",
                                                children: relation.title || "-"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 633,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 629,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-2xl border border-slate-200 bg-white px-4 py-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500",
                                                children: "Identity"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 636,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-2 text-sm text-slate-700",
                                                children: [
                                                    relation.identities.length,
                                                    " channel terdaftar"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 639,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 635,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 617,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 space-y-2",
                                children: relation.identities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500",
                                    children: "Contact ini belum memiliki identity."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                    lineNumber: 647,
                                    columnNumber: 19
                                }, this) : relation.identities.slice(0, 3).map((identity)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 md:flex-row md:items-center md:justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-semibold text-slate-900",
                                                        children: identity.channel
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                        lineNumber: 657,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-slate-600",
                                                        children: identity.handle
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                        lineNumber: 660,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 656,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${Number(identity.is_verified || 0) === 1 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaCheckCircle"], {
                                                        className: "text-[10px]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                        lineNumber: 669,
                                                        columnNumber: 25
                                                    }, this),
                                                    Number(identity.is_verified || 0) === 1 ? "Verified" : "Pending"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                                lineNumber: 662,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, identity.id, true, {
                                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                        lineNumber: 652,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                                lineNumber: 645,
                                columnNumber: 15
                            }, this)
                        ]
                    }, relation.id, true, {
                        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                        lineNumber: 569,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                lineNumber: 567,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RelationFormModal, {
                open: modalOpen,
                onClose: ()=>{
                    if (saving) return;
                    setModalOpen(false);
                    setModalInitial(null);
                    setModalError(null);
                },
                initial: modalInitial,
                onSubmit: submitRelation,
                saving: saving,
                error: modalError,
                contacts: activeContacts,
                positions: activePositions
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                lineNumber: 681,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ConfirmDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                open: confirmOpen,
                title: "Hapus Relasi Contact",
                description: "Yakin ingin menghapus relasi contact dari branch customer ini?",
                confirmLabel: "Hapus",
                cancelLabel: "Batal",
                onCancel: ()=>{
                    setConfirmOpen(false);
                    actionRef.current = null;
                },
                onConfirm: async ()=>{
                    setConfirmOpen(false);
                    const action = actionRef.current;
                    actionRef.current = null;
                    if (!action) return;
                    try {
                        await action();
                    } catch (deleteError) {
                        setError(deleteError instanceof Error ? deleteError.message : String(deleteError));
                    }
                }
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
                lineNumber: 697,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/branch_customer/BCContactRelationsPanel.tsx",
        lineNumber: 493,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/branch_customer/BCDetailModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BCDetailModal",
    ()=>BCDetailModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$hi2$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/hi2/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$paymentAccount$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/paymentAccount.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/fetchAllQueryRows.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadMoreButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/LoadMoreButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$branch_customer$2f$BCContactRelationsPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/branch_customer/BCContactRelationsPanel.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
const PRODUCT_NEED_OPTIONS = [
    "Bahan Baku Springbed & Sofa",
    "Furniture"
];
const PAYMENT_METHOD_OPTIONS = [
    "Transfer",
    "Giro",
    "Cash"
];
const TAX_STATUS_OPTIONS = [
    {
        value: 0,
        label: "Non PKP"
    },
    {
        value: 1,
        label: "PKP"
    }
];
const ERP_PAGE_SIZE = 20;
const WILAYAH_BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";
function normalizeName(value) {
    return (value || "").trim().toLowerCase();
}
function matchByName(options, value) {
    const target = normalizeName(value);
    if (!target) return null;
    return options.find((opt)=>normalizeName(opt.name) === target) || null;
}
function emptyShippingAreaState() {
    return {
        provinceCode: "",
        regencyCode: "",
        regencies: [],
        districts: []
    };
}
function normalizeOptionalEmail(value) {
    const trimmed = value.trim();
    return trimmed || null;
}
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function normalizeNpwpDigits(value) {
    return value.replace(/\D/g, "");
}
function mergeUniqueByName(current, incoming) {
    const map = new Map();
    for (const item of [
        ...current,
        ...incoming
    ]){
        const key = item.name.trim();
        if (!key) continue;
        map.set(key, item);
    }
    return Array.from(map.values());
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
    return rows.map((row)=>({
            code: String(row.code || row.id || ""),
            name: String(row.name || "")
        })).filter((row)=>Boolean(row.code && row.name));
}
function toNum(v) {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
        const p = Number.parseInt(v, 10);
        if (Number.isFinite(p)) return p;
    }
    return undefined;
}
function dt(v) {
    if (!v) return "-";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return d.toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short"
    });
}
function normalizeDecimalInput(value) {
    return value.replace(/[^\d.,-]/g, "").replace(",", ".");
}
function parseNullableFloat(value) {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
}
function parseNullableInt(value) {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isFinite(parsed) ? parsed : null;
}
function formatNullableNumber(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "-";
    }
    return new Intl.NumberFormat("id-ID").format(Number(value));
}
function renderReadOnlyField(label, value, className = "") {
    const isEmptyString = typeof value === "string" && value.trim() === "";
    const content = value === null || value === undefined || isEmptyString ? "-" : value;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-1.5 text-[11px] font-medium text-slate-600",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                lineNumber: 352,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
                children: content
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                lineNumber: 353,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
        lineNumber: 351,
        columnNumber: 5
    }, this);
}
function getPolicyLevelBadge(level) {
    const normalized = String(level || "").trim().toLowerCase();
    if (normalized === "nbid") return "NB";
    if (normalized === "gpid") return "GP";
    if (normalized === "gcid") return "GC";
    if (normalized === "bcid") return "BC";
    return normalized ? normalized.toUpperCase() : "-";
}
function getPolicyLevelName(level, relation, fallbackBc) {
    const normalized = String(level || "").trim().toLowerCase();
    if (normalized === "nbid") {
        return [
            relation?.nb_name,
            relation?.nb_code
        ].filter(Boolean).join(" - ") || "-";
    }
    if (normalized === "gpid") {
        return [
            relation?.gp_name,
            relation?.gp_code
        ].filter(Boolean).join(" - ") || "-";
    }
    if (normalized === "gcid") {
        return [
            relation?.gc_name,
            relation?.gc_code
        ].filter(Boolean).join(" - ") || "-";
    }
    if (normalized === "bcid") {
        return fallbackBc || "-";
    }
    return "-";
}
function buildEditSnapshot(input) {
    return JSON.stringify({
        editedOwner: input.editedOwner.trim(),
        editedOwnerPhone: input.editedOwnerPhone.trim(),
        editedOwnerEmail: input.editedOwnerEmail.trim(),
        editedOwnerPlaceOfBirth: input.editedOwnerPlaceOfBirth.trim(),
        editedOwnerDateOfBirth: input.editedOwnerDateOfBirth,
        editedProductNeed: input.editedProductNeed.trim(),
        editedNotes: input.editedNotes.trim(),
        editedPaymentAccount: input.editedPaymentAccount.trim(),
        editedPaymentMethod: input.editedPaymentMethod.trim(),
        editedSalesTeam: input.editedSalesTeam.trim(),
        editedTaxStatus: input.editedTaxStatus,
        editedNpwp: normalizeNpwpDigits(input.editedNpwp),
        editedCreditLimitActive: input.editedCreditLimitActive,
        editedCreditLimit: normalizeDecimalInput(input.editedCreditLimit),
        editedPaymentTermActive: input.editedPaymentTermActive,
        editedPaymentTerm: input.editedPaymentTerm.trim(),
        editedLimitCustomerOverdueActive: input.editedLimitCustomerOverdueActive,
        editedLimitCustomerOverdue: input.editedLimitCustomerOverdue.trim(),
        editedRows: input.editedRows.map((row)=>({
                id: row.id,
                type: row.type || "",
                label: row.label || "",
                address: row.address || "",
                city: row.city || "",
                district: row.district || "",
                village: row.village || "",
                province: row.province || "",
                postal_code: row.postal_code || "",
                pic_name: row.pic_name || "",
                pic_phone: row.pic_phone || "",
                is_default: row.is_default ? 1 : 0
            })),
        deletedRowIds: [
            ...input.deletedRowIds
        ].sort((a, b)=>a - b)
    });
}
function BCDetailModal({ isOpen, onClose, bc, onBCUpdate, onViewBC, onViewGP, onViewGC }) {
    const { token, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [detailError, setDetailError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [addressError, setAddressError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [detail, setDetail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [gp, setGp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [gc, setGc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [nb, setNb] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [relatedBCs, setRelatedBCs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [relatedBCsLoading, setRelatedBCsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [relatedBCsError, setRelatedBCsError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("company");
    const [isEditMode, setIsEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editedOwner, setEditedOwner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedOwnerPhone, setEditedOwnerPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedOwnerEmail, setEditedOwnerEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedOwnerPlaceOfBirth, setEditedOwnerPlaceOfBirth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedOwnerDateOfBirth, setEditedOwnerDateOfBirth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedProductNeed, setEditedProductNeed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedNotes, setEditedNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedPaymentAccount, setEditedPaymentAccount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedPaymentMethod, setEditedPaymentMethod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedSalesTeam, setEditedSalesTeam] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedTaxStatus, setEditedTaxStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [editedNpwp, setEditedNpwp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedCreditLimitActive, setEditedCreditLimitActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [editedCreditLimit, setEditedCreditLimit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedPaymentTermActive, setEditedPaymentTermActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [editedPaymentTerm, setEditedPaymentTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedLimitCustomerOverdueActive, setEditedLimitCustomerOverdueActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [editedLimitCustomerOverdue, setEditedLimitCustomerOverdue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedRows, setEditedRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [deletedRowIds, setDeletedRowIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [editSnapshot, setEditSnapshot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [showExitConfirm, setShowExitConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [provinces, setProvinces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shippingAreaStates, setShippingAreaStates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [paymentAccountInfo, setPaymentAccountInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [paymentAccountError, setPaymentAccountError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [optionError, setOptionError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [rekeningOptions, setRekeningOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [salesTeamOptions, setSalesTeamOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [rekeningLoading, setRekeningLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rekeningHasMore, setRekeningHasMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rekeningStart, setRekeningStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [policyActiveInfo, setPolicyActiveInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [policyActiveInfoLoading, setPolicyActiveInfoLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [policyActiveInfoError, setPolicyActiveInfoError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const regencyCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const districtCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const contentScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const branchIdForErp = toNum(detail?.branch) ?? bc?.branch_id;
    const resolveSalesTeamValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((value)=>{
        if (typeof value === "object" && value) {
            if (value.id !== undefined && value.id !== null) return String(value.id);
            if (value.name) return value.name;
        }
        if (typeof value === "number" || typeof value === "string") {
            return String(value);
        }
        return "";
    }, []);
    const resolveSalesTeamLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((value)=>{
        if (typeof value === "object" && value) {
            return value.sales_team_name || value.name || (value.id ? String(value.id) : "-");
        }
        const raw = typeof value === "number" || typeof value === "string" ? String(value) : "";
        if (!raw) return "-";
        const match = salesTeamOptions.find((option)=>String(option.id) === raw || option.code === raw);
        return match?.label || raw;
    }, [
        salesTeamOptions
    ]);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!isOpen || !bc || !token || !isAuthenticated) return;
        setLoading(true);
        setDetailError(null);
        setAddressError(null);
        setDetail(null);
        setRows([]);
        setGp(null);
        setGc(null);
        setNb(null);
        setRelatedBCs([]);
        setRelatedBCsError(null);
        try {
            const dRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2}/${bc.id}`, {
                fields: [
                    "*",
                    "created_by.full_name",
                    "updated_by.full_name"
                ]
            }), {
                method: "GET",
                cache: "no-store"
            }, token);
            if (!dRes.ok) throw new Error(`Gagal memuat detail Branch Customer (${dRes.status})`);
            const dJson = await dRes.json();
            const dRow = dJson?.data || null;
            setDetail(dRow);
            const parentId = dRow?.id ?? bc.id;
            const addressRows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
                endpoint: "/api/resource/customer_address",
                spec: {
                    fields: [
                        "*"
                    ],
                    filters: [
                        [
                            "parent_type",
                            "=",
                            "branch_customer"
                        ],
                        [
                            "parent_id",
                            "=",
                            parentId
                        ]
                    ]
                },
                token,
                errorMessage: "Gagal memuat customer_address"
            }).catch((error)=>{
                setAddressError(error instanceof Error ? error.message : String(error));
                return [];
            });
            const sorted = addressRows.sort((a, b)=>{
                const idxA = toNum(a.idx) ?? Number.MAX_SAFE_INTEGER;
                const idxB = toNum(b.idx) ?? Number.MAX_SAFE_INTEGER;
                if (idxA !== idxB) return idxA - idxB;
                return (toNum(a.id) ?? Number.MAX_SAFE_INTEGER) - (toNum(b.id) ?? Number.MAX_SAFE_INTEGER);
            });
            setRows(sorted);
            setEditedRows(sorted);
            const gcid = toNum(dRow?.gcid) ?? bc.gc_id;
            if (!gcid) return;
            const gcRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_CUSTOMER, {
                fields: [
                    "*"
                ],
                filters: [
                    [
                        "id",
                        "=",
                        gcid
                    ]
                ],
                limit: 1
            }), {
                method: "GET",
                cache: "no-store"
            }, token);
            const gcJson = gcRes.ok ? await gcRes.json() : {
                data: []
            };
            const gcRow = Array.isArray(gcJson?.data) ? gcJson.data[0] : null;
            if (!gcRow) return;
            const gcMapped = {
                id: Number(gcRow.id),
                code: gcRow.name || undefined,
                name: gcRow.gc_name || gcRow.name || "-",
                gp_id: Number(gcRow.gpid || 0),
                created_at: gcRow.created_at || new Date(0).toISOString(),
                updated_at: gcRow.updated_at || gcRow.created_at || new Date(0).toISOString(),
                disabled: Number(gcRow.disabled || 0)
            };
            setGc(gcMapped);
            setRelatedBCsLoading(true);
            try {
                const bcRows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
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
                                gcMapped.id
                            ]
                        ]
                    },
                    token,
                    errorMessage: "Gagal memuat branch customer pada hierarki"
                });
                const branchIds = Array.from(new Set(bcRows.map((row)=>row.branch && typeof row.branch === "object" ? toNum(row.branch.id) : toNum(row.branch)).filter((id)=>typeof id === "number")));
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
                            if (!row.id) return;
                            branchMap.set(Number(row.id), {
                                name: row.branch_name || undefined,
                                city: row.city || undefined
                            });
                        });
                    }
                }
                const mappedBCs = bcRows.map((row)=>{
                    const branchId = row.branch && typeof row.branch === "object" ? toNum(row.branch.id) || 0 : toNum(row.branch) || 0;
                    const branchRef = branchMap.get(branchId);
                    const directBranchName = row.branch && typeof row.branch === "object" ? row.branch.branch_name || undefined : undefined;
                    const directBranchCity = row.branch && typeof row.branch === "object" ? row.branch.city || undefined : undefined;
                    return {
                        id: Number(row.id),
                        code: row.name || undefined,
                        name: row.bcid_name || row.name || `${gcMapped.name} - ${directBranchCity || branchRef?.city || "-"}`,
                        gc_id: gcMapped.id,
                        gc_name: gcMapped.name,
                        gc_code: gcMapped.code,
                        gp_name: bc.gp_name,
                        gp_code: bc.gp_code,
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
                        payment_method: row.payment_method || undefined,
                        payment_account: row.payment_account || undefined,
                        receipt_delivery_method: row.receipt_delivery_method || undefined,
                        receipt_issued_at: row.receipt_issued_at || undefined,
                        notes: row.notes || undefined,
                        tax_status: row.tax_status ?? undefined,
                        npwp: row.npwp || undefined,
                        created_at: row.created_at || new Date(0).toISOString(),
                        updated_at: row.updated_at || row.created_at || new Date(0).toISOString(),
                        created_by: (typeof row.created_by === "object" ? row.created_by?.full_name : undefined) || row["created_by.full_name"] || undefined,
                        updated_by: (typeof row.updated_by === "object" ? row.updated_by?.full_name : undefined) || row["updated_by.full_name"] || undefined,
                        disabled: Number(row.disabled || 0)
                    };
                });
                setRelatedBCs(mappedBCs.sort((a, b)=>(a.name || a.code || "").localeCompare(b.name || b.code || "", "id-ID")));
            } catch (error) {
                setRelatedBCs([]);
                setRelatedBCsError(error instanceof Error ? error.message : "Gagal memuat hierarki branch customer");
            } finally{
                setRelatedBCsLoading(false);
            }
            if (!gcMapped.gp_id) return;
            const gpRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_PARENT, {
                fields: [
                    "*"
                ],
                filters: [
                    [
                        "id",
                        "=",
                        gcMapped.gp_id
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
            const gpRow = Array.isArray(gpJson?.data) ? gpJson.data[0] : null;
            if (!gpRow) return;
            const gpMapped = {
                id: Number(gpRow.id),
                code: gpRow.name || undefined,
                name: gpRow.gp_name || gpRow.name || "-",
                created_at: gpRow.created_at || new Date(0).toISOString(),
                updated_at: gpRow.updated_at || gpRow.created_at || new Date(0).toISOString(),
                disabled: Number(gpRow.disabled || 0)
            };
            setGp(gpMapped);
            const nbId = typeof gpRow.nbid === "number" ? gpRow.nbid : toNum(gpRow.nbid?.id);
            if (!nbId) return;
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
            const nbRow = Array.isArray(nbJson?.data) ? nbJson.data[0] : null;
            if (nbRow) setNb({
                code: nbRow.name || `NB${nbRow.id}`,
                name: nbRow.nb_name || nbRow.name || "-"
            });
        } catch (e) {
            setDetailError(e instanceof Error ? e.message : String(e));
        } finally{
            setLoading(false);
        }
    }, [
        isOpen,
        bc,
        token,
        isAuthenticated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        load();
    }, [
        load
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen) return;
        setIsEditMode(false);
        setIsSaving(false);
        setShowExitConfirm(false);
        setDeletedRowIds([]);
        setEditSnapshot("");
    }, [
        isOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen) return;
        setActiveTab("company");
    }, [
        isOpen,
        bc?.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen) return;
        contentScrollRef.current?.scrollTo({
            top: 0,
            behavior: "auto"
        });
    }, [
        activeTab,
        isOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        async function loadPolicyActiveInfo() {
            const currentBcCode = detail?.name || bc?.code || bc?.name || "";
            if (!isOpen || !token || !isAuthenticated || !currentBcCode) {
                setPolicyActiveInfo(null);
                setPolicyActiveInfoError(null);
                setPolicyActiveInfoLoading(false);
                return;
            }
            setPolicyActiveInfoLoading(true);
            setPolicyActiveInfoError(null);
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_customer_policy_active_info_by_bc`), {
                    method: "POST",
                    cache: "no-store",
                    body: JSON.stringify({
                        bcid: currentBcCode
                    })
                }, token);
                if (!response.ok) {
                    throw new Error(`Gagal memuat policy aktif branch customer (${response.status})`);
                }
                const json = await response.json();
                if (!cancelled) {
                    setPolicyActiveInfo(json?.data || null);
                }
            } catch (error) {
                if (!cancelled) {
                    setPolicyActiveInfo(null);
                    setPolicyActiveInfoError(error instanceof Error ? error.message : "Gagal memuat policy aktif branch customer");
                }
            } finally{
                if (!cancelled) {
                    setPolicyActiveInfoLoading(false);
                }
            }
        }
        void loadPolicyActiveInfo();
        return ()=>{
            cancelled = true;
        };
    }, [
        bc?.code,
        bc?.name,
        detail?.name,
        isAuthenticated,
        isOpen,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        async function loadPaymentAccount() {
            const branchId = toNum(detail?.branch) ?? bc?.branch_id;
            const paymentAccount = detail?.payment_account || "";
            if (!isOpen || !token || !branchId || !paymentAccount) {
                setPaymentAccountInfo(null);
                setPaymentAccountError(null);
                return;
            }
            try {
                setPaymentAccountError(null);
                const info = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$paymentAccount$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPaymentAccountInfo"])({
                    branchId,
                    paymentAccount,
                    authToken: token
                });
                if (!cancelled) {
                    setPaymentAccountInfo(info);
                }
            } catch (error) {
                if (!cancelled) {
                    setPaymentAccountInfo(null);
                    setPaymentAccountError(error instanceof Error ? error.message : "Gagal memuat rekening");
                }
            }
        }
        void loadPaymentAccount();
        return ()=>{
            cancelled = true;
        };
    }, [
        bc?.branch_id,
        detail?.branch,
        detail?.payment_account,
        isOpen,
        token
    ]);
    const loadRekeningOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (start)=>{
        if (!isEditMode || !token || !branchIdForErp) return;
        if (start === 0) setRekeningLoading(true);
        else setRekeningLoading(true);
        try {
            setOptionError(null);
            const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$paymentAccount$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBranchErpResourcePage"])({
                branchId: branchIdForErp,
                authToken: token,
                resource: "Rekening",
                fields: [
                    "name",
                    "nama_rekening",
                    "bank"
                ],
                limit: ERP_PAGE_SIZE,
                start
            });
            setRekeningOptions((prev)=>start === 0 ? mergeUniqueByName([], rows) : mergeUniqueByName(prev, rows));
            setRekeningStart(start + rows.length);
            setRekeningHasMore(rows.length === ERP_PAGE_SIZE);
        } catch (error) {
            setOptionError(error instanceof Error ? error.message : "Gagal memuat pilihan rekening");
        } finally{
            setRekeningLoading(false);
        }
    }, [
        branchIdForErp,
        isEditMode,
        token
    ]);
    const loadSalesTeamOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!token) return;
        try {
            const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
                endpoint: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.SALES_TEAM,
                spec: {
                    fields: [
                        "id",
                        "name",
                        "sales_team_name"
                    ]
                },
                token,
                errorMessage: "Gagal memuat sales team"
            });
            setSalesTeamOptions(rows.filter((row)=>row.id !== undefined && row.id !== null).map((row)=>({
                    id: row.id,
                    code: row.name || String(row.id),
                    label: row.sales_team_name || row.name || String(row.id)
                })));
        } catch (error) {
            setOptionError(error instanceof Error ? error.message : "Gagal memuat pilihan sales team");
        }
    }, [
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isEditMode) {
            setOptionError(null);
            setRekeningOptions([]);
            setSalesTeamOptions([]);
            setRekeningHasMore(false);
            setRekeningStart(0);
            return;
        }
        if (!token || !branchIdForErp) {
            setOptionError("Branch belum tersedia untuk memuat data ERP.");
            return;
        }
        void loadRekeningOptions(0);
        void loadSalesTeamOptions();
    }, [
        branchIdForErp,
        isEditMode,
        loadRekeningOptions,
        loadSalesTeamOptions,
        token
    ]);
    const getRegencies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (provinceCode)=>{
        if (!provinceCode) return [];
        if (regencyCache.current[provinceCode]) return regencyCache.current[provinceCode];
        const rows = await fetchWilayah(`regencies/${provinceCode}.json`);
        regencyCache.current[provinceCode] = rows;
        return rows;
    }, []);
    const getDistricts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (regencyCode)=>{
        if (!regencyCode) return [];
        if (districtCache.current[regencyCode]) return districtCache.current[regencyCode];
        const rows = await fetchWilayah(`districts/${regencyCode}.json`);
        districtCache.current[regencyCode] = rows;
        return rows;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        async function loadProvinces() {
            if (!isOpen) return;
            try {
                const rows = await fetchWilayah("provinces.json");
                if (!cancelled) setProvinces(rows);
            } catch  {
                if (!cancelled) setProvinces([]);
            }
        }
        void loadProvinces();
        return ()=>{
            cancelled = true;
        };
    }, [
        isOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        async function syncAreaStates() {
            if (!isEditMode || editedRows.length === 0 || provinces.length === 0) {
                setShippingAreaStates(editedRows.map(()=>emptyShippingAreaState()));
                return;
            }
            const next = await Promise.all(editedRows.map(async (row)=>{
                const province = matchByName(provinces, row.province);
                if (!province) return emptyShippingAreaState();
                const regencies = await getRegencies(province.code);
                const regency = matchByName(regencies, row.city);
                if (!regency) {
                    return {
                        provinceCode: province.code,
                        regencyCode: "",
                        regencies,
                        districts: []
                    };
                }
                const districts = await getDistricts(regency.code);
                return {
                    provinceCode: province.code,
                    regencyCode: regency.code,
                    regencies,
                    districts
                };
            }));
            if (!cancelled) setShippingAreaStates(next);
        }
        void syncAreaStates();
        return ()=>{
            cancelled = true;
        };
    }, [
        editedRows,
        getDistricts,
        getRegencies,
        isEditMode,
        provinces
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen || !bc) return;
        if (isEditMode) return;
        setEditedOwner((detail?.branch_owner || bc.owner_name || "").trim());
        setEditedOwnerPhone((detail?.branch_owner_phone || bc.owner_phone || "").trim());
        setEditedOwnerEmail((detail?.branch_owner_email || bc.owner_email || "").trim());
        setEditedOwnerPlaceOfBirth((detail?.branch_owner_place_of_birth || "").trim());
        setEditedOwnerDateOfBirth(detail?.branch_owner_date_of_birth?.split("T")[0] || "");
        setEditedProductNeed((detail?.product_need || "").trim());
        setEditedNotes((detail?.notes || "").trim());
        setEditedPaymentAccount((detail?.payment_account || "").trim());
        setEditedPaymentMethod((detail?.payment_method || "").trim());
        setEditedSalesTeam(resolveSalesTeamValue(detail?.sales_team));
        setEditedTaxStatus(Number(detail?.tax_status || 0));
        setEditedNpwp((detail?.npwp || "").trim());
        setEditedCreditLimitActive(Number(detail?.credit_limit_active || 0));
        setEditedCreditLimit(detail?.credit_limit === null || detail?.credit_limit === undefined ? "" : String(detail.credit_limit));
        setEditedPaymentTermActive(Number(detail?.payment_term_active || 0));
        setEditedPaymentTerm(detail?.payment_term === null || detail?.payment_term === undefined ? "" : String(detail.payment_term));
        setEditedLimitCustomerOverdueActive(Number(detail?.limit_customer_overdue_active || 0));
        setEditedLimitCustomerOverdue(detail?.limit_customer_overdue === null || detail?.limit_customer_overdue === undefined ? "" : String(detail.limit_customer_overdue));
        setOptionError(null);
    }, [
        isOpen,
        bc,
        detail?.branch_owner,
        detail?.branch_owner_phone,
        detail?.branch_owner_email,
        detail?.branch_owner_place_of_birth,
        detail?.branch_owner_date_of_birth,
        detail?.product_need,
        detail?.notes,
        detail?.payment_account,
        detail?.payment_method,
        detail?.sales_team,
        detail?.tax_status,
        detail?.npwp,
        detail?.credit_limit_active,
        detail?.credit_limit,
        detail?.payment_term_active,
        detail?.payment_term,
        detail?.limit_customer_overdue_active,
        detail?.limit_customer_overdue,
        isEditMode,
        resolveSalesTeamValue
    ]);
    const hasUnsavedChanges = isEditMode && editSnapshot !== buildEditSnapshot({
        editedOwner,
        editedOwnerPhone,
        editedOwnerEmail,
        editedOwnerPlaceOfBirth,
        editedOwnerDateOfBirth,
        editedProductNeed,
        editedNotes,
        editedPaymentAccount,
        editedPaymentMethod,
        editedSalesTeam,
        editedTaxStatus,
        editedNpwp,
        editedCreditLimitActive,
        editedCreditLimit,
        editedPaymentTermActive,
        editedPaymentTerm,
        editedLimitCustomerOverdueActive,
        editedLimitCustomerOverdue,
        editedRows,
        deletedRowIds
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen) return;
        const onKey = (e)=>{
            if (e.key !== "Escape" || isSaving) return;
            if (hasUnsavedChanges) {
                setShowExitConfirm(true);
                return;
            }
            setShowExitConfirm(false);
            setIsEditMode(false);
            setDeletedRowIds([]);
            setEditSnapshot("");
            onClose();
        };
        window.addEventListener("keydown", onKey);
        return ()=>window.removeEventListener("keydown", onKey);
    }, [
        isOpen,
        hasUnsavedChanges,
        isSaving,
        onClose
    ]);
    const startEdit = ()=>{
        if (!bc) return;
        const owner = (detail?.branch_owner || bc.owner_name || "").trim();
        const ownerPhone = (detail?.branch_owner_phone || bc.owner_phone || "").trim();
        const ownerEmail = (detail?.branch_owner_email || bc.owner_email || "").trim();
        const ownerPob = (detail?.branch_owner_place_of_birth || "").trim();
        const ownerDob = detail?.branch_owner_date_of_birth?.split("T")[0] || "";
        const productNeed = (detail?.product_need || "").trim();
        const notes = (detail?.notes || "").trim();
        const paymentAccount = (detail?.payment_account || "").trim();
        const paymentMethod = (detail?.payment_method || "").trim();
        const salesTeam = resolveSalesTeamValue(detail?.sales_team).trim();
        const taxStatus = Number(detail?.tax_status || 0);
        const npwp = (detail?.npwp || "").trim();
        const creditLimitActive = Number(detail?.credit_limit_active || 0);
        const creditLimit = detail?.credit_limit === null || detail?.credit_limit === undefined ? "" : String(detail.credit_limit);
        const paymentTermActive = Number(detail?.payment_term_active || 0);
        const paymentTerm = detail?.payment_term === null || detail?.payment_term === undefined ? "" : String(detail.payment_term);
        const limitCustomerOverdueActive = Number(detail?.limit_customer_overdue_active || 0);
        const limitCustomerOverdue = detail?.limit_customer_overdue === null || detail?.limit_customer_overdue === undefined ? "" : String(detail.limit_customer_overdue);
        const rowSnapshot = rows.map((row)=>({
                ...row
            }));
        setEditedOwner(owner);
        setEditedOwnerPhone(ownerPhone);
        setEditedOwnerEmail(ownerEmail);
        setEditedOwnerPlaceOfBirth(ownerPob);
        setEditedOwnerDateOfBirth(ownerDob);
        setEditedProductNeed(productNeed);
        setEditedNotes(notes);
        setEditedPaymentAccount(paymentAccount);
        setEditedPaymentMethod(paymentMethod);
        setEditedSalesTeam(salesTeam);
        setEditedTaxStatus(taxStatus);
        setEditedNpwp(npwp);
        setEditedCreditLimitActive(creditLimitActive);
        setEditedCreditLimit(creditLimit);
        setEditedPaymentTermActive(paymentTermActive);
        setEditedPaymentTerm(paymentTerm);
        setEditedLimitCustomerOverdueActive(limitCustomerOverdueActive);
        setEditedLimitCustomerOverdue(limitCustomerOverdue);
        setEditedRows(rowSnapshot);
        setDeletedRowIds([]);
        setEditSnapshot(buildEditSnapshot({
            editedOwner: owner,
            editedOwnerPhone: ownerPhone,
            editedOwnerEmail: ownerEmail,
            editedOwnerPlaceOfBirth: ownerPob,
            editedOwnerDateOfBirth: ownerDob,
            editedProductNeed: productNeed,
            editedNotes: notes,
            editedPaymentAccount: paymentAccount,
            editedPaymentMethod: paymentMethod,
            editedSalesTeam: salesTeam,
            editedTaxStatus: taxStatus,
            editedNpwp: npwp,
            editedCreditLimitActive: creditLimitActive,
            editedCreditLimit: creditLimit,
            editedPaymentTermActive: paymentTermActive,
            editedPaymentTerm: paymentTerm,
            editedLimitCustomerOverdueActive: limitCustomerOverdueActive,
            editedLimitCustomerOverdue: limitCustomerOverdue,
            editedRows: rowSnapshot,
            deletedRowIds: []
        }));
        setIsEditMode(true);
    };
    const closeDirectly = ()=>{
        setShowExitConfirm(false);
        setIsEditMode(false);
        setDeletedRowIds([]);
        setEditSnapshot("");
        onClose();
    };
    const attemptClose = ()=>{
        if (isSaving) return;
        if (hasUnsavedChanges) {
            setShowExitConfirm(true);
            return;
        }
        closeDirectly();
    };
    const cancelEdit = ()=>{
        setEditedRows(rows);
        setDeletedRowIds([]);
        setEditSnapshot("");
        setShowExitConfirm(false);
        setOptionError(null);
        setIsEditMode(false);
    };
    const updateEditedRow = (rowId, field, value)=>{
        setEditedRows((prev)=>prev.map((row)=>row.id === rowId ? {
                    ...row,
                    [field]: value
                } : row));
    };
    const onShippingProvinceChange = async (idx, provinceCode)=>{
        const selected = provinces.find((x)=>x.code === provinceCode) || null;
        const row = editedRows[idx];
        if (!row) return;
        updateEditedRow(row.id, "province", selected?.name || "");
        updateEditedRow(row.id, "city", "");
        updateEditedRow(row.id, "district", "");
        setShippingAreaStates((prev)=>{
            const next = [
                ...prev
            ];
            next[idx] = {
                provinceCode,
                regencyCode: "",
                regencies: [],
                districts: []
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
                    regencies,
                    districts: []
                };
                return next;
            });
        } catch (e) {
            setAddressError(e instanceof Error ? e.message : "Gagal memuat kota/kabupaten.");
        }
    };
    const onShippingRegencyChange = async (idx, regencyCode)=>{
        const state = shippingAreaStates[idx] || emptyShippingAreaState();
        const row = editedRows[idx];
        if (!row) return;
        const selected = state.regencies.find((x)=>x.code === regencyCode) || null;
        updateEditedRow(row.id, "city", selected?.name || "");
        updateEditedRow(row.id, "district", "");
        setShippingAreaStates((prev)=>{
            const next = [
                ...prev
            ];
            next[idx] = {
                ...state,
                regencyCode,
                districts: []
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
                    districts
                };
                return next;
            });
        } catch (e) {
            setAddressError(e instanceof Error ? e.message : "Gagal memuat kecamatan.");
        }
    };
    const onShippingDistrictChange = (idx, districtCode)=>{
        const state = shippingAreaStates[idx] || emptyShippingAreaState();
        const row = editedRows[idx];
        if (!row) return;
        const selected = state.districts.find((x)=>x.code === districtCode) || null;
        updateEditedRow(row.id, "district", selected?.name || "");
    };
    const addShippingAddress = ()=>{
        if (!bc) return;
        const nextId = -Date.now();
        setEditedRows((prev)=>[
                ...prev,
                {
                    id: nextId,
                    parent_id: bc.id,
                    parent_type: "branch_customer",
                    type: "shipping",
                    label: "Alamat Pengiriman",
                    address: "",
                    city: "",
                    district: "",
                    village: "",
                    province: "",
                    postal_code: "",
                    pic_name: "",
                    pic_phone: "",
                    is_default: 0
                }
            ]);
        setShippingAreaStates((prev)=>[
                ...prev,
                emptyShippingAreaState()
            ]);
    };
    const removeAddress = (idx)=>{
        const target = editedRows[idx];
        if (!target) return;
        if (target.id > 0) {
            setDeletedRowIds((prev)=>[
                    ...new Set([
                        ...prev,
                        target.id
                    ])
                ]);
        }
        setEditedRows((prev)=>prev.filter((_, i)=>i !== idx));
        setShippingAreaStates((prev)=>prev.filter((_, i)=>i !== idx));
    };
    const applyEdit = async ()=>{
        if (!bc || !token || !isAuthenticated) return;
        const normalizedEmail = normalizeOptionalEmail(editedOwnerEmail);
        if (normalizedEmail && !isValidEmail(normalizedEmail)) {
            alert("Format email penanggung jawab tidak valid.");
            return;
        }
        const normalizedNpwp = normalizeNpwpDigits(editedNpwp);
        const creditLimit = parseNullableFloat(editedCreditLimit);
        const paymentTerm = parseNullableInt(editedPaymentTerm);
        const limitCustomerOverdue = parseNullableInt(editedLimitCustomerOverdue);
        if (editedTaxStatus === 1) {
            if (!normalizedNpwp || normalizedNpwp.length < 15 || normalizedNpwp.length > 16) {
                alert("Nomor NPWP wajib 15-16 digit saat Tax Status = PKP.");
                return;
            }
        }
        setIsSaving(true);
        try {
            const payload = {
                branch_owner: editedOwner.trim() || null,
                branch_owner_phone: editedOwnerPhone.trim() || null,
                branch_owner_email: normalizedEmail,
                branch_owner_place_of_birth: editedOwnerPlaceOfBirth.trim() || null,
                branch_owner_date_of_birth: editedOwnerDateOfBirth ? `${editedOwnerDateOfBirth}T00:00:00Z` : null,
                product_need: editedProductNeed.trim() || null,
                notes: editedNotes.trim() || null,
                payment_account: editedPaymentAccount.trim() || null,
                payment_method: editedPaymentMethod.trim() || null,
                sales_team: editedSalesTeam.trim() || null,
                credit_limit_active: editedCreditLimitActive,
                credit_limit: creditLimit,
                payment_term_active: editedPaymentTermActive,
                payment_term: paymentTerm,
                limit_customer_overdue_active: editedLimitCustomerOverdueActive,
                limit_customer_overdue: limitCustomerOverdue,
                tax_status: editedTaxStatus,
                npwp: editedTaxStatus === 1 ? normalizedNpwp : null
            };
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResourceUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2, bc.id), {
                method: "PUT",
                body: JSON.stringify(payload),
                cache: "no-store"
            }, token);
            if (!res.ok) {
                throw new Error(`Failed to update Branch Customer (${res.status})`);
            }
            const addressUpsertResults = await Promise.allSettled(editedRows.map((row)=>row.id > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResourceUrl"])("/api/resource/customer_address", row.id), {
                    method: "PUT",
                    body: JSON.stringify({
                        address: row.address || null,
                        city: row.city || null,
                        district: row.district || null,
                        village: row.village || null,
                        province: row.province || null,
                        postal_code: row.postal_code || null,
                        pic_name: row.pic_name || null,
                        pic_phone: row.pic_phone || null,
                        type: row.type || null,
                        label: row.label || null,
                        is_default: row.is_default ? 1 : 0
                    }),
                    cache: "no-store"
                }, token) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResourceUrl"])("/api/resource/customer_address"), {
                    method: "POST",
                    body: JSON.stringify({
                        parent_type: "branch_customer",
                        parent_id: bc.id,
                        address: row.address || null,
                        city: row.city || null,
                        district: row.district || null,
                        village: row.village || null,
                        province: row.province || null,
                        postal_code: row.postal_code || null,
                        pic_name: row.pic_name || null,
                        pic_phone: row.pic_phone || null,
                        type: row.type || "shipping",
                        label: row.label || "Alamat Pengiriman",
                        is_default: row.is_default ? 1 : 0
                    }),
                    cache: "no-store"
                }, token)));
            const addressDeleteResults = await Promise.allSettled(deletedRowIds.map((id)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResourceUrl"])("/api/resource/customer_address", id), {
                    method: "DELETE",
                    cache: "no-store"
                }, token)));
            const hasAddressError = [
                ...addressUpsertResults,
                ...addressDeleteResults
            ].some((result)=>result.status === "rejected" || result.status === "fulfilled" && !result.value.ok);
            if (hasAddressError) {
                throw new Error("Gagal update sebagian alamat customer.");
            }
            setDetail((prev)=>prev ? {
                    ...prev,
                    branch_owner: editedOwner.trim() || null,
                    branch_owner_phone: editedOwnerPhone.trim() || null,
                    branch_owner_email: normalizedEmail,
                    branch_owner_place_of_birth: editedOwnerPlaceOfBirth.trim() || null,
                    branch_owner_date_of_birth: editedOwnerDateOfBirth ? `${editedOwnerDateOfBirth}T00:00:00Z` : null,
                    product_need: editedProductNeed.trim() || null,
                    notes: editedNotes.trim() || null,
                    payment_account: editedPaymentAccount.trim() || null,
                    payment_method: editedPaymentMethod.trim() || null,
                    sales_team: editedSalesTeam.trim() || null,
                    credit_limit_active: editedCreditLimitActive,
                    credit_limit: creditLimit,
                    payment_term_active: editedPaymentTermActive,
                    payment_term: paymentTerm,
                    limit_customer_overdue_active: editedLimitCustomerOverdueActive,
                    limit_customer_overdue: limitCustomerOverdue,
                    tax_status: editedTaxStatus,
                    npwp: editedTaxStatus === 1 ? normalizedNpwp : null,
                    updated_at: new Date().toISOString()
                } : prev);
            await load();
            const updatedBC = {
                ...bc,
                credit_limit_active: editedCreditLimitActive,
                credit_limit: creditLimit,
                payment_term_active: editedPaymentTermActive,
                payment_term: paymentTerm,
                limit_customer_overdue_active: editedLimitCustomerOverdueActive,
                limit_customer_overdue: limitCustomerOverdue,
                owner_name: editedOwner.trim() || undefined,
                owner_phone: editedOwnerPhone.trim() || undefined,
                owner_email: normalizedEmail || undefined,
                payment_account: editedPaymentAccount.trim() || undefined,
                payment_method: editedPaymentMethod.trim() || undefined,
                receipt_delivery_method: detail?.receipt_delivery_method || undefined,
                receipt_issued_at: detail?.receipt_issued_at || undefined,
                updated_at: new Date().toISOString()
            };
            onBCUpdate?.(updatedBC);
            setDeletedRowIds([]);
            setEditSnapshot("");
            setShowExitConfirm(false);
            setOptionError(null);
            setIsEditMode(false);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Gagal update Branch Customer");
        } finally{
            setIsSaving(false);
        }
    };
    const displayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const explicit = (detail?.bcid_name || "").trim();
        if (explicit) return explicit;
        const gcName = (bc?.gc_name || "").trim();
        const city = (bc?.branch_city || "").trim();
        return gcName && city ? `${gcName} - ${city}` : bc?.name || "-";
    }, [
        detail?.bcid_name,
        bc?.gc_name,
        bc?.branch_city,
        bc?.name
    ]);
    if (!bc) return null;
    const bcCode = detail?.name || bc.code || `BC${bc.id}`;
    const gcName = gc?.name || bc.gc_name || "-";
    const branchOwner = detail?.branch_owner || bc.owner_name || "-";
    const branchOwnerPhone = detail?.branch_owner_phone || bc.owner_phone || "-";
    const branchOwnerEmail = detail?.branch_owner_email || bc.owner_email || "-";
    const branchOwnerDob = detail?.branch_owner_date_of_birth?.split("T")[0] || "-";
    const description = detail?.description || "-";
    const notes = detail?.notes || "-";
    const paymentAccount = paymentAccountInfo?.nama_rekening || detail?.payment_account || "-";
    const paymentAccountNumber = paymentAccountInfo?.nomor_rekening || detail?.payment_account || "-";
    const paymentMethod = detail?.payment_method || "-";
    const receiptDeliveryMethod = detail?.receipt_delivery_method || "-";
    const receiptIssuedAt = detail?.receipt_issued_at || "-";
    const salesTeam = resolveSalesTeamLabel(detail?.sales_team);
    const taxStatusLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$paymentAccount$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTaxStatusLabel"])(detail?.tax_status);
    const npwpValue = detail?.npwp || "-";
    const customerRegister = detail?.customer_register === null || detail?.customer_register === undefined ? "-" : String(detail.customer_register);
    const isCashLabel = Number(detail?.is_cash || 0) === 1 ? "Cash" : "Non Cash";
    const branchLocation = [
        bc.branch_name,
        bc.branch_city
    ].filter(Boolean).join(", ") || "-";
    const availableRekeningOptions = editedPaymentAccount && !rekeningOptions.some((item)=>item.name === editedPaymentAccount) ? [
        {
            name: editedPaymentAccount
        },
        ...rekeningOptions
    ] : rekeningOptions;
    const availableSalesOptions = editedSalesTeam && !salesTeamOptions.some((item)=>String(item.id) === editedSalesTeam || item.code === editedSalesTeam) ? [
        {
            id: editedSalesTeam,
            code: editedSalesTeam,
            label: resolveSalesTeamLabel(detail?.sales_team)
        },
        ...salesTeamOptions
    ] : salesTeamOptions;
    const selectedRekeningOption = availableRekeningOptions.find((item)=>item.name === editedPaymentAccount) || null;
    const displayAddressRows = isEditMode ? editedRows : rows;
    const createdBy = detail?.["created_by.full_name"] || bc.created_by || "System";
    const updatedBy = detail?.["updated_by.full_name"] || bc.updated_by || "System";
    const headerStatus = detail?.status || "-";
    const isActive = Number(detail?.disabled ?? bc.disabled ?? 0) !== 1;
    const ownerInitial = branchOwner !== "-" ? branchOwner.charAt(0).toUpperCase() : "B";
    const inheritedCreditLimit = policyActiveInfo?.policy?.final_credit_limit ?? null;
    const inheritedPaymentTerm = policyActiveInfo?.policy?.final_payment_term ?? null;
    const creditLimitLevel = policyActiveInfo?.policy?.credit_limit_level;
    const paymentTermLevel = policyActiveInfo?.policy?.payment_term_level;
    const creditLimitSourceName = getPolicyLevelName(creditLimitLevel, policyActiveInfo?.relation, `${displayName} - ${bcCode}`);
    const paymentTermSourceName = getPolicyLevelName(paymentTermLevel, policyActiveInfo?.relation, `${displayName} - ${bcCode}`);
    const creditLimitSiblings = (policyActiveInfo?.scopes?.credit_limit?.bcs || []).filter((row)=>Number(row.id) !== Number(bc.id));
    const creditLimitScopeTotal = Number(policyActiveInfo?.scopes?.credit_limit?.total || policyActiveInfo?.scopes?.credit_limit?.bcs?.length || 0);
    const detailTabs = [
        {
            key: "company",
            label: "Data Perusahaan",
            shortLabel: "Perusahaan",
            caption: "Profil, owner, operasional",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaBuilding"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                lineNumber: 1795,
                columnNumber: 13
            }, this)
        },
        {
            key: "finance",
            label: "Data Keuangan",
            shortLabel: "Keuangan",
            caption: "Limit, term, rekening",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaWarehouse"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                lineNumber: 1802,
                columnNumber: 13
            }, this)
        },
        {
            key: "hierarchy",
            label: "Hierarki",
            shortLabel: "Hierarki",
            caption: "Parent & branch",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUsers"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                lineNumber: 1809,
                columnNumber: 13
            }, this)
        },
        {
            key: "address",
            label: "Alamat",
            shortLabel: "Alamat",
            caption: "Alamat terdaftar saja",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                lineNumber: 1816,
                columnNumber: 13
            }, this)
        },
        {
            key: "contacts",
            label: "Contacts",
            shortLabel: "Kontak",
            caption: "Relasi contact customer",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaAddressBook"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                lineNumber: 1823,
                columnNumber: 13
            }, this)
        },
        {
            key: "activity",
            label: "Aktivitas",
            shortLabel: "Aktivitas",
            caption: "Riwayat Data",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaClock"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                lineNumber: 1830,
                columnNumber: 13
            }, this)
        }
    ];
    const typeTone = (type)=>{
        const normalized = (type || "").toLowerCase();
        if (normalized.includes("office")) {
            return {
                card: "bg-blue-50/60 border-blue-200",
                top: "border-t-blue-500",
                badge: "bg-blue-600 text-white"
            };
        }
        return {
            card: "bg-emerald-50/60 border-emerald-200",
            top: "border-t-emerald-500",
            badge: "bg-emerald-100 text-emerald-700"
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4",
            onClick: (e)=>e.target === e.currentTarget && attemptClose(),
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-4 py-4 md:px-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap items-center gap-2.5 md:gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaBuilding"], {
                                                    className: "text-lg text-blue-600 md:text-xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                    lineNumber: 1867,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-lg font-bold text-slate-900 md:text-xl",
                                                    children: "Branch Customer Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                    lineNumber: 1868,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700",
                                                    children: headerStatus
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                    lineNumber: 1871,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                            lineNumber: 1866,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "pl-8 text-xs font-semibold text-slate-500",
                                            children: [
                                                "BCID: ",
                                                bcCode
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                            lineNumber: 1875,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                    lineNumber: 1865,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: attemptClose,
                                    className: "rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$hi2$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HiXMark"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                        lineNumber: 1883,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                    lineNumber: 1879,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                            lineNumber: 1864,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                        lineNumber: 1863,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: contentScrollRef,
                        className: "flex-1 overflow-y-auto bg-slate-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-5 p-4 md:space-y-6 md:p-6",
                            children: [
                                detailError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaExclamationTriangle"], {
                                            className: "mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                            lineNumber: 1895,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: detailError
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                            lineNumber: 1896,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                    lineNumber: 1894,
                                    columnNumber: 19
                                }, this),
                                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-slate-500",
                                    children: "Memuat detail branch customer..."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                    lineNumber: 1900,
                                    columnNumber: 19
                                }, this),
                                isEditMode && optionError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700",
                                    children: optionError
                                }, void 0, false, {
                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                    lineNumber: 1905,
                                    columnNumber: 19
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-5 lg:gap-6 xl:grid-cols-[260px_minmax(0,1fr)]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                            className: "xl:sticky xl:top-6 xl:self-start",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "hidden border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_55%),linear-gradient(135deg,#eff6ff,#ffffff_55%,#f8fafc)] px-5 py-5 xl:block",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[11px] font-bold uppercase tracking-[0.28em] text-blue-700",
                                                                children: "Panel Detail"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                lineNumber: 1914,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "mt-2 text-lg font-bold text-slate-900",
                                                                children: "Navigasi Data"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                lineNumber: 1917,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-1 text-sm text-slate-500",
                                                                children: "Pilih kategori informasi branch customer."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                lineNumber: 1920,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                        lineNumber: 1913,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-2 gap-2 p-2 md:grid-cols-3 xl:grid-cols-1 xl:p-3",
                                                        children: detailTabs.map((tab)=>{
                                                            const active = activeTab === tab.key;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setActiveTab(tab.key),
                                                                className: `group flex w-full min-w-0 flex-col items-start gap-2 rounded-2xl border px-3 py-3 text-left transition-all sm:px-4 xl:flex-row xl:items-center xl:gap-3 xl:px-4 ${active ? "border-blue-500 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200/70" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/70"}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"}`,
                                                                        children: tab.icon
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 1938,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "block text-xs font-bold sm:text-sm xl:hidden",
                                                                                children: tab.shortLabel
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 1948,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "hidden text-sm font-bold xl:block",
                                                                                children: tab.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 1951,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `hidden text-xs xl:block ${active ? "text-blue-50" : "text-slate-500"}`,
                                                                                children: tab.caption
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 1954,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 1947,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, tab.key, true, {
                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                lineNumber: 1928,
                                                                columnNumber: 29
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                        lineNumber: 1924,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                lineNumber: 1912,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                            lineNumber: 1911,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-5",
                                            children: [
                                                activeTab === "company" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: isEditMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                                className: "overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "bg-[linear-gradient(135deg,#0f172a_0%,#172554_45%,#2563eb_100%)] px-6 py-6 text-white",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-start justify-between gap-4",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-xs font-bold uppercase tracking-[0.28em] text-blue-200",
                                                                                            children: "Data Perusahaan"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 1978,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                            className: "mt-1 text-2xl font-bold",
                                                                                            children: displayName
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 1981,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "mt-1 text-sm text-blue-100",
                                                                                            children: [
                                                                                                "Branch Code: ",
                                                                                                bcCode
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 1984,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 1977,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaBuilding"], {
                                                                                        className: "text-2xl"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 1989,
                                                                                        columnNumber: 37
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 1988,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 1976,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 1975,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-2xl border border-amber-100 bg-amber-50/70 p-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700",
                                                                                        children: "Customer ID"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 1996,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mt-2 text-base font-bold text-slate-900",
                                                                                        children: bcCode
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 1999,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 1995,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700",
                                                                                        children: "Branch Location"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2004,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mt-2 text-base font-bold text-slate-900",
                                                                                        children: branchLocation
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2007,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2003,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-2xl border border-rose-100 bg-rose-50/70 p-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[10px] font-bold uppercase tracking-[0.22em] text-rose-700",
                                                                                        children: "Product Need"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2012,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                        value: editedProductNeed,
                                                                                        onChange: (e)=>setEditedProductNeed(e.target.value),
                                                                                        className: "mt-2 w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none",
                                                                                        disabled: isSaving,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                value: "",
                                                                                                children: "Pilih kebutuhan produk"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2023,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            PRODUCT_NEED_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                    value: option,
                                                                                                    children: option
                                                                                                }, option, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2027,
                                                                                                    columnNumber: 39
                                                                                                }, this))
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2015,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2011,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-700",
                                                                                        children: "Sales Team"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2034,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "mt-2",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                            value: editedSalesTeam,
                                                                                            onChange: (e)=>setEditedSalesTeam(e.target.value),
                                                                                            className: "w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none",
                                                                                            disabled: isSaving,
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                    value: "",
                                                                                                    children: "Pilih sales team"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2046,
                                                                                                    columnNumber: 39
                                                                                                }, this),
                                                                                                availableSalesOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                        value: String(option.id),
                                                                                                        children: option.label
                                                                                                    }, `${option.id}-${option.code}`, false, {
                                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                        lineNumber: 2048,
                                                                                                        columnNumber: 41
                                                                                                    }, this))
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2038,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2037,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2033,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-2xl border border-fuchsia-100 bg-fuchsia-50/70 p-4 md:col-span-2 xl:col-span-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[10px] font-bold uppercase tracking-[0.22em] text-fuchsia-700",
                                                                                        children: "Notes"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2059,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                                        value: editedNotes,
                                                                                        onChange: (e)=>setEditedNotes(e.target.value),
                                                                                        className: "mt-2 min-h-[88px] w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none",
                                                                                        disabled: isSaving,
                                                                                        placeholder: "Notes"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2062,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2058,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 1994,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                lineNumber: 1974,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                                className: "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mb-6 flex items-center gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUsers"], {
                                                                                    className: "text-lg"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2078,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2077,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[11px] font-bold uppercase tracking-[0.24em] text-blue-700",
                                                                                        children: "Data Pemilik"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2081,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                        className: "text-2xl font-bold text-slate-900",
                                                                                        children: "Branch Owner"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2084,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2080,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 2076,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "grid gap-5 lg:grid-cols-[1.1fr_0.9fr]",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#eff6ff,#ffffff_65%,#f8fafc)] p-6",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-4",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-600",
                                                                                            children: ownerInitial
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2093,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "min-w-0",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                    type: "text",
                                                                                                    value: editedOwner,
                                                                                                    onChange: (e)=>setEditedOwner(e.target.value),
                                                                                                    className: "w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-lg font-bold text-slate-900 focus:border-blue-500 focus:outline-none",
                                                                                                    placeholder: "Nama owner",
                                                                                                    disabled: isSaving
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2097,
                                                                                                    columnNumber: 39
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                    className: "mt-1 text-sm text-slate-500",
                                                                                                    children: "Managing Director"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2107,
                                                                                                    columnNumber: 39
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2096,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2092,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2091,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "space-y-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "rounded-2xl border border-slate-200 bg-white p-4",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500",
                                                                                                children: "Email"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2116,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "space-y-2",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                        type: "text",
                                                                                                        value: editedOwnerEmail,
                                                                                                        onChange: (e)=>setEditedOwnerEmail(e.target.value),
                                                                                                        className: "w-full rounded-xl border border-blue-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none",
                                                                                                        placeholder: "Email owner",
                                                                                                        disabled: isSaving
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                        lineNumber: 2120,
                                                                                                        columnNumber: 39
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                        className: "text-[11px] text-slate-500",
                                                                                                        children: "Kosongkan jika tidak ada. Saat disimpan akan dikirim sebagai null."
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                        lineNumber: 2130,
                                                                                                        columnNumber: 39
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2119,
                                                                                                columnNumber: 37
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2115,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "rounded-2xl border border-slate-200 bg-white p-4",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500",
                                                                                                children: "Phone"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2137,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                type: "text",
                                                                                                value: editedOwnerPhone,
                                                                                                onChange: (e)=>setEditedOwnerPhone(e.target.value),
                                                                                                className: "w-full rounded-xl border border-blue-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none",
                                                                                                placeholder: "Phone owner",
                                                                                                disabled: isSaving
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2140,
                                                                                                columnNumber: 37
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2136,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "rounded-2xl border border-slate-200 bg-white p-4",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500",
                                                                                                children: "Tempat / Tanggal Lahir"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2152,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "grid gap-3 md:grid-cols-2",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                        type: "text",
                                                                                                        value: editedOwnerPlaceOfBirth,
                                                                                                        onChange: (e)=>setEditedOwnerPlaceOfBirth(e.target.value),
                                                                                                        className: "rounded-xl border border-blue-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none",
                                                                                                        placeholder: "Tempat lahir",
                                                                                                        disabled: isSaving
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                        lineNumber: 2156,
                                                                                                        columnNumber: 39
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                        type: "date",
                                                                                                        value: editedOwnerDateOfBirth,
                                                                                                        onChange: (e)=>setEditedOwnerDateOfBirth(e.target.value),
                                                                                                        className: "rounded-xl border border-blue-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none",
                                                                                                        disabled: isSaving
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                        lineNumber: 2168,
                                                                                                        columnNumber: 39
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2155,
                                                                                                columnNumber: 37
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2151,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2114,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 2090,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                lineNumber: 2075,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                                className: "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mb-6 flex items-center gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaWarehouse"], {
                                                                                    className: "text-lg"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2188,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2187,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[11px] font-bold uppercase tracking-[0.24em] text-amber-700",
                                                                                        children: "Operasional"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2191,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                        className: "text-2xl font-bold text-slate-900",
                                                                                        children: "Pembayaran dan Dokumen"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2194,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2190,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 2186,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-2xl border border-violet-100 bg-violet-50/70 p-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-700",
                                                                                        children: "Payment Method"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2202,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                        value: editedPaymentMethod,
                                                                                        onChange: (e)=>setEditedPaymentMethod(e.target.value),
                                                                                        className: "w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none",
                                                                                        disabled: isSaving,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                value: "",
                                                                                                children: "Pilih payment method"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2213,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            PAYMENT_METHOD_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                    value: option,
                                                                                                    children: option
                                                                                                }, option, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2217,
                                                                                                    columnNumber: 39
                                                                                                }, this))
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2205,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2201,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-700",
                                                                                        children: "Receipt Delivery Method"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2225,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-sm font-semibold text-slate-900",
                                                                                        children: receiptDeliveryMethod
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2228,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2224,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-2xl border border-lime-100 bg-lime-50/70 p-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-lime-700",
                                                                                        children: "Receipt Issued At"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2234,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-sm font-semibold text-slate-900",
                                                                                        children: receiptIssuedAt
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2237,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2233,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700",
                                                                                        children: "Tax Status"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2243,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                        value: String(editedTaxStatus),
                                                                                        onChange: (e)=>setEditedTaxStatus(Number(e.target.value)),
                                                                                        className: "w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none",
                                                                                        disabled: isSaving,
                                                                                        children: TAX_STATUS_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                value: option.value,
                                                                                                children: option.label
                                                                                            }, option.value, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2255,
                                                                                                columnNumber: 39
                                                                                            }, this))
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2246,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    editedTaxStatus === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "mt-4 border-t border-emerald-200 pt-4",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-rose-700",
                                                                                                children: "NPWP"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2266,
                                                                                                columnNumber: 39
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                        type: "text",
                                                                                                        value: editedNpwp,
                                                                                                        onChange: (e)=>setEditedNpwp(normalizeNpwpDigits(e.target.value)),
                                                                                                        inputMode: "numeric",
                                                                                                        maxLength: 16,
                                                                                                        className: "w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none",
                                                                                                        disabled: isSaving,
                                                                                                        placeholder: "15-16 digit"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                        lineNumber: 2270,
                                                                                                        columnNumber: 41
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                        className: "mt-1 text-xs text-slate-500",
                                                                                                        children: "Nomor NPWP harus 15-16 digit."
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                        lineNumber: 2286,
                                                                                                        columnNumber: 41
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2265,
                                                                                        columnNumber: 37
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2242,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-2xl border border-indigo-100 bg-white p-4 md:col-span-2 xl:col-span-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-700",
                                                                                        children: "Payment Account"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2295,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "space-y-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                                value: editedPaymentAccount,
                                                                                                onChange: (e)=>setEditedPaymentAccount(e.target.value),
                                                                                                className: "w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none",
                                                                                                disabled: isSaving || rekeningLoading,
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                        value: "",
                                                                                                        children: "Pilih payment account"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                        lineNumber: 2307,
                                                                                                        columnNumber: 39
                                                                                                    }, this),
                                                                                                    availableRekeningOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: option.name,
                                                                                                            children: [
                                                                                                                option.name,
                                                                                                                option.nama_rekening,
                                                                                                                option.bank
                                                                                                            ].filter(Boolean).join(" - ")
                                                                                                        }, option.name, false, {
                                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                            lineNumber: 2312,
                                                                                                            columnNumber: 43
                                                                                                        }, this))
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2299,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            selectedRekeningOption ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-600",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                        className: "font-semibold text-slate-900",
                                                                                                        children: selectedRekeningOption.nama_rekening || selectedRekeningOption.name
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                        lineNumber: 2329,
                                                                                                        columnNumber: 41
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                        children: selectedRekeningOption.bank || "-"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                        lineNumber: 2333,
                                                                                                        columnNumber: 41
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2328,
                                                                                                columnNumber: 39
                                                                                            }, this) : null,
                                                                                            rekeningHasMore ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadMoreButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                                onClick: ()=>void loadRekeningOptions(rekeningStart),
                                                                                                loading: rekeningLoading,
                                                                                                hasMore: rekeningHasMore,
                                                                                                currentCount: availableRekeningOptions.length,
                                                                                                totalCount: availableRekeningOptions.length + (rekeningHasMore ? 1 : 0)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2339,
                                                                                                columnNumber: 39
                                                                                            }, this) : null
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2298,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2294,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 2200,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                lineNumber: 2185,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                                className: "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-start justify-between gap-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600",
                                                                                        children: "Data Perusahaan"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2366,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                        className: "mt-2 text-2xl font-bold text-slate-900",
                                                                                        children: displayName
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2369,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mt-1 text-sm text-slate-500",
                                                                                        children: "Profil branch customer, owner, dan operasional."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2372,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2365,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-2xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700",
                                                                                children: [
                                                                                    "BCID: ",
                                                                                    bcCode
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2377,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 2364,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-5 grid gap-4 xl:grid-cols-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                                                className: "rounded-[24px] border border-slate-200 bg-slate-50/80 p-5",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-500",
                                                                                        children: "Company Profile"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2384,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                        className: "mt-1 text-xl font-bold text-slate-900",
                                                                                        children: "Informasi Perusahaan"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2387,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "mt-4 grid gap-3 md:grid-cols-2",
                                                                                        children: [
                                                                                            renderReadOnlyField("Branch Customer ID", bcCode),
                                                                                            renderReadOnlyField("Group Customer", gc?.code || bc.gc_code || "-"),
                                                                                            renderReadOnlyField("Nama Perusahaan", displayName, "md:col-span-2"),
                                                                                            renderReadOnlyField("Branch Location", branchLocation),
                                                                                            renderReadOnlyField("Sales Team", salesTeam),
                                                                                            renderReadOnlyField("Product Need", detail?.product_need || "-"),
                                                                                            renderReadOnlyField("Customer Register", customerRegister),
                                                                                            renderReadOnlyField("Status", detail?.status || "-"),
                                                                                            renderReadOnlyField("Tax Status", taxStatusLabel),
                                                                                            renderReadOnlyField("NPWP", npwpValue),
                                                                                            renderReadOnlyField("Is Cash", isCashLabel),
                                                                                            renderReadOnlyField("Description", description, "md:col-span-2"),
                                                                                            renderReadOnlyField("Notes", notes, "md:col-span-2")
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2390,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2383,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                                                className: "rounded-[24px] border border-slate-200 bg-slate-50/80 p-5",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-500",
                                                                                        children: "Primary Contact"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2447,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                        className: "mt-1 text-xl font-bold text-slate-900",
                                                                                        children: "Identitas Pemilik"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2450,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "mt-4 grid gap-3 md:grid-cols-2",
                                                                                        children: [
                                                                                            renderReadOnlyField("Nama Owner", branchOwner),
                                                                                            renderReadOnlyField("Telepon", branchOwnerPhone),
                                                                                            renderReadOnlyField("Email", branchOwnerEmail),
                                                                                            renderReadOnlyField("Tempat Lahir", detail?.branch_owner_place_of_birth || "-"),
                                                                                            renderReadOnlyField("Tanggal Lahir", branchOwnerDob, "md:col-span-2")
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2453,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2446,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                                                className: "rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 xl:col-span-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-500",
                                                                                        children: "Operasional"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2480,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                        className: "mt-1 text-xl font-bold text-slate-900",
                                                                                        children: "Pembayaran dan Dokumen"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2483,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3",
                                                                                        children: [
                                                                                            renderReadOnlyField("Payment Method", paymentMethod),
                                                                                            renderReadOnlyField("Receipt Delivery Method", receiptDeliveryMethod),
                                                                                            renderReadOnlyField("Receipt Issued At", receiptIssuedAt),
                                                                                            renderReadOnlyField("Payment Account", paymentAccount),
                                                                                            renderReadOnlyField("Nomor Rekening", paymentAccountNumber),
                                                                                            renderReadOnlyField("Bank", paymentAccountInfo?.bank || "-")
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2486,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    paymentAccountError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mt-3 text-xs text-amber-700",
                                                                                        children: "Detail rekening belum bisa dimuat."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 2513,
                                                                                        columnNumber: 37
                                                                                    }, this) : null
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2479,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 2382,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                lineNumber: 2363,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm",
                                                                children: [
                                                                    nb ? `NBID: ${nb.code} (${nb.name})` : null,
                                                                    detail?.sync_saga_id ? ` - Sync Saga: ${detail.sync_saga_id}` : null,
                                                                    detail?.status ? ` - Status: ${detail.status}` : null,
                                                                    !isActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "ml-2 inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 font-semibold text-red-700",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaBan"], {
                                                                                className: "text-[10px]"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2531,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            " Disabled"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 2530,
                                                                        columnNumber: 33
                                                                    }, this) : null
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                lineNumber: 2521,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                }, void 0, false),
                                                activeTab === "finance" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                    className: "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-6 flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaWarehouse"], {
                                                                        className: "text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 2544,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2543,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-[11px] font-bold uppercase tracking-[0.24em] text-amber-700",
                                                                            children: "Data Keuangan"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2547,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "text-2xl font-bold text-slate-900",
                                                                            children: "Credit, Limit, dan Payment"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2550,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2546,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 2542,
                                                            columnNumber: 25
                                                        }, this),
                                                        !isEditMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-6 space-y-4",
                                                            children: [
                                                                policyActiveInfoError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
                                                                    children: policyActiveInfoError
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2559,
                                                                    columnNumber: 31
                                                                }, this) : null,
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#fff7ed,#ffffff_60%,#eff6ff)] p-5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-wrap items-start justify-between gap-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-[11px] font-bold uppercase tracking-[0.24em] text-amber-700",
                                                                                            children: "Policy Aktif"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2567,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "mt-1 text-sm text-slate-500",
                                                                                            children: "Menunjukkan limit final yang dipakai dan asal setting policy-nya."
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2573,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2566,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                policyActiveInfoLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm",
                                                                                    children: "Memuat policy..."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2579,
                                                                                    columnNumber: 35
                                                                                }, this) : creditLimitLevel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800",
                                                                                    children: [
                                                                                        "Shared ke ",
                                                                                        creditLimitScopeTotal,
                                                                                        " BC"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2583,
                                                                                    columnNumber: 35
                                                                                }, this) : null
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2565,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-5 grid gap-4 md:grid-cols-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "rounded-2xl border border-amber-100 bg-white/90 p-4",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700",
                                                                                            children: "Credit Limit"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2591,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "mt-2 text-xl font-bold text-slate-900",
                                                                                            children: formatNullableNumber(inheritedCreditLimit)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2594,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "mt-3 flex items-center gap-2",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "rounded-full bg-amber-600 px-2.5 py-1 text-[10px] font-bold text-white",
                                                                                                    children: getPolicyLevelBadge(creditLimitLevel)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2598,
                                                                                                    columnNumber: 37
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-sm font-semibold text-slate-700",
                                                                                                    children: creditLimitSourceName
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2601,
                                                                                                    columnNumber: 37
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2597,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2590,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "rounded-2xl border border-teal-100 bg-white/90 p-4",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-[10px] font-bold uppercase tracking-[0.22em] text-teal-700",
                                                                                            children: "Payment Term"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2608,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "mt-2 text-xl font-bold text-slate-900",
                                                                                            children: [
                                                                                                formatNullableNumber(inheritedPaymentTerm),
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-xs font-semibold text-slate-500",
                                                                                                    children: "Hari"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2613,
                                                                                                    columnNumber: 37
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2611,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "mt-3 flex items-center gap-2",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "rounded-full bg-teal-600 px-2.5 py-1 text-[10px] font-bold text-white",
                                                                                                    children: getPolicyLevelBadge(paymentTermLevel)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2619,
                                                                                                    columnNumber: 37
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-sm font-semibold text-slate-700",
                                                                                                    children: paymentTermSourceName
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2622,
                                                                                                    columnNumber: 37
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2618,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2607,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2589,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2564,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-3xl border border-slate-200 bg-slate-50/90 p-5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-wrap items-start justify-between gap-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-[11px] font-bold uppercase tracking-[0.24em] text-slate-600",
                                                                                            children: "Siblings Limit"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2633,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "mt-1 text-sm text-slate-500",
                                                                                            children: "Berdasarkan scope credit limit aktif untuk branch customer ini."
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2639,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2632,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm",
                                                                                    children: [
                                                                                        creditLimitSiblings.length,
                                                                                        " sibling"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2644,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2631,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        creditLimitSiblings.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-500",
                                                                            children: "Tidak ada sibling lain. Credit limit aktif saat ini hanya dipakai BC ini."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2650,
                                                                            columnNumber: 33
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-4 grid gap-3 md:grid-cols-2",
                                                                            children: creditLimitSiblings.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "rounded-2xl border border-slate-200 bg-white p-4",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "flex items-start justify-between gap-3",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "min-w-0",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                            className: "text-sm font-bold text-slate-900",
                                                                                                            children: row.customer_name || row.name || `BC${row.id}`
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                            lineNumber: 2663,
                                                                                                            columnNumber: 43
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                            className: "mt-1 text-xs font-semibold text-slate-500",
                                                                                                            children: row.name || `BC${row.id}`
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                            lineNumber: 2668,
                                                                                                            columnNumber: 43
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2662,
                                                                                                    columnNumber: 41
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600",
                                                                                                    children: row.branch_code || "BC"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2672,
                                                                                                    columnNumber: 41
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2661,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "mt-3 text-sm text-slate-600",
                                                                                            children: row.branch_name || "-"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2676,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "mt-1 text-xs font-semibold text-slate-500",
                                                                                            children: [
                                                                                                "Status: ",
                                                                                                row.status || "-"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2679,
                                                                                            columnNumber: 39
                                                                                        }, this)
                                                                                    ]
                                                                                }, row.id, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2657,
                                                                                    columnNumber: 37
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2655,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2630,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 2557,
                                                            columnNumber: 27
                                                        }, this),
                                                        isEditMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
                                                            children: "Pengaturan pembayaran telah dipindahkan ke tab Data Perusahaan."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 2691,
                                                            columnNumber: 27
                                                        }, this) : null
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                    lineNumber: 2541,
                                                    columnNumber: 23
                                                }, this),
                                                activeTab === "hierarchy" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid gap-4 xl:grid-cols-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                            className: "rounded-3xl border border-purple-100 bg-white p-5 shadow-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-4 flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500 text-white",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaArrowUp"], {
                                                                                className: "h-4 w-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2704,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2703,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs font-semibold uppercase tracking-[0.24em] text-purple-500",
                                                                                    children: "Parent Hierarki"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2707,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-slate-500",
                                                                                    children: "National Brand, Group Parent, dan Group Customer"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2710,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2706,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2702,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-3",
                                                                    children: [
                                                                        nb ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs font-semibold uppercase tracking-wide text-indigo-600",
                                                                                    children: "National Brand"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2719,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "mt-1 font-semibold text-slate-900",
                                                                                    children: nb.name
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2722,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-indigo-600",
                                                                                    children: [
                                                                                        "NBID: ",
                                                                                        nb.code
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2725,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2718,
                                                                            columnNumber: 31
                                                                        }, this) : null,
                                                                        gp ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>onViewGP?.(gp),
                                                                            className: "flex w-full items-center justify-between rounded-2xl border border-purple-100 bg-purple-50/70 px-4 py-3 text-left transition-all hover:border-purple-300 hover:bg-purple-50",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-xs font-semibold uppercase tracking-wide text-purple-600",
                                                                                            children: "Group Parent"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2738,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "mt-1 font-semibold text-slate-900",
                                                                                            children: gp.name
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2741,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-sm text-purple-600",
                                                                                            children: [
                                                                                                "GPID: ",
                                                                                                gp.code || `GP${gp.id}`
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2744,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2737,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaChevronRight"], {
                                                                                    className: "h-4 w-4 text-purple-500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2748,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2732,
                                                                            columnNumber: 31
                                                                        }, this) : null,
                                                                        gc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>onViewGC?.(gc),
                                                                            className: "flex w-full items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-left transition-all hover:border-blue-300 hover:bg-blue-50",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-xs font-semibold uppercase tracking-wide text-blue-600",
                                                                                            children: "Group Customer"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2759,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "mt-1 font-semibold text-slate-900",
                                                                                            children: gc.name
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2762,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-sm text-blue-600",
                                                                                            children: [
                                                                                                "GCID: ",
                                                                                                gc.code || `GC${gc.id}`
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2765,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2758,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaChevronRight"], {
                                                                                    className: "h-4 w-4 text-blue-500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2769,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2753,
                                                                            columnNumber: 31
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm italic text-slate-500",
                                                                            children: "Data parent customer belum lengkap."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2772,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2716,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 2701,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                            className: "rounded-3xl border border-orange-100 bg-white p-5 shadow-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-4 flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaArrowDown"], {
                                                                                className: "h-4 w-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2782,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2781,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs font-semibold uppercase tracking-[0.24em] text-orange-500",
                                                                                    children: "Branch Customer"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2785,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-slate-500",
                                                                                    children: relatedBCsLoading ? "Memuat data..." : `${relatedBCs.length} data terdaftar`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2788,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2784,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2780,
                                                                    columnNumber: 27
                                                                }, this),
                                                                relatedBCsError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
                                                                    children: relatedBCsError
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2797,
                                                                    columnNumber: 29
                                                                }, this) : null,
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "max-h-[360px] space-y-2 overflow-y-auto pr-1",
                                                                    children: relatedBCs.length > 0 ? relatedBCs.map((item)=>{
                                                                        const isCurrent = Number(item.id) === Number(bc.id);
                                                                        const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "font-semibold text-slate-900",
                                                                                            children: item.name || `${gcName} - ${item.branch_city || "-"}`
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2810,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-xs text-slate-500",
                                                                                            children: [
                                                                                                "BCID: ",
                                                                                                item.code || `BC${item.id}`,
                                                                                                " •",
                                                                                                " ",
                                                                                                item.branch_city || item.branch_name || "-"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2814,
                                                                                            columnNumber: 39
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2809,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-2",
                                                                                    children: [
                                                                                        isCurrent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700",
                                                                                            children: "Current"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2823,
                                                                                            columnNumber: 41
                                                                                        }, this) : null,
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaChevronRight"], {
                                                                                            className: "h-4 w-4 text-orange-500"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2827,
                                                                                            columnNumber: 39
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2821,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true);
                                                                        if (onViewBC) {
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>onViewBC(item),
                                                                                className: `flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${isCurrent ? "border-orange-300 bg-orange-50" : "border-orange-100 bg-orange-50/60 hover:border-orange-300 hover:bg-orange-50"}`,
                                                                                children: content
                                                                            }, item.id, false, {
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 2834,
                                                                                columnNumber: 37
                                                                            }, this);
                                                                        }
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `flex items-center justify-between rounded-2xl border px-4 py-3 ${isCurrent ? "border-orange-300 bg-orange-50" : "border-orange-100 bg-orange-50/60"}`,
                                                                            children: content
                                                                        }, item.id, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2850,
                                                                            columnNumber: 35
                                                                        }, this);
                                                                    }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm italic text-slate-500",
                                                                        children: "Belum ada BC terkait pada hierarki ini."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 2863,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2802,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 2779,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                    lineNumber: 2700,
                                                    columnNumber: 23
                                                }, this),
                                                addressError && activeTab === "address" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaExclamationTriangle"], {
                                                            className: "mt-0.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 2874,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: addressError
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 2875,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                    lineNumber: 2873,
                                                    columnNumber: 23
                                                }, this),
                                                activeTab === "address" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                    className: "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-5 flex items-start justify-between gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-700",
                                                                            children: "Data Alamat"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2883,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "mt-2 text-2xl font-bold text-slate-900",
                                                                            children: "Registered Addresses"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2886,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-1 text-sm text-slate-500",
                                                                            children: "Tab ini hanya menampilkan alamat branch customer."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2889,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2882,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700",
                                                                    children: [
                                                                        displayAddressRows.length,
                                                                        " Addresses total"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2893,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 2881,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-3 flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "flex items-center gap-2 text-lg font-bold text-slate-900",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {
                                                                            className: "text-slate-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2900,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        "Address List"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2899,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: isEditMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: addShippingAddress,
                                                                        className: "rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700",
                                                                        children: "+ Alamat Pengiriman"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                        lineNumber: 2905,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2903,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 2898,
                                                            columnNumber: 25
                                                        }, this),
                                                        displayAddressRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500",
                                                            children: "Tidak ada data `customer_address`."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 2916,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-1 gap-4 xl:grid-cols-3",
                                                            children: displayAddressRows.map((r, idx)=>{
                                                                const tone = typeTone(r.type);
                                                                const typeLabel = (r.type || r.label || "ADDRESS").toUpperCase();
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `rounded-xl border border-t-4 p-5 ${tone.card} ${tone.top}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mb-3 flex items-start justify-between gap-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs font-bold uppercase tracking-tight text-slate-700",
                                                                                    children: (r.label || "Address").toUpperCase()
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2934,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: `rounded px-2 py-0.5 text-[10px] font-bold ${tone.badge}`,
                                                                                            children: typeLabel
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2938,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        isEditMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>removeAddress(idx),
                                                                                            className: "rounded border border-red-200 bg-red-50 p-1 text-red-600 hover:bg-red-100",
                                                                                            disabled: isSaving,
                                                                                            title: "Hapus alamat",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTrash"], {
                                                                                                className: "h-3 w-3"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 2951,
                                                                                                columnNumber: 43
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2944,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2937,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2933,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        isEditMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                            value: r.address || "",
                                                                            onChange: (e)=>updateEditedRow(r.id, "address", e.target.value),
                                                                            className: "mb-3 min-h-[72px] w-full rounded-md border border-blue-300 px-2 py-1 text-sm text-slate-800 focus:border-blue-500 focus:outline-none",
                                                                            disabled: isSaving
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2957,
                                                                            columnNumber: 37
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mb-4 text-sm font-medium leading-relaxed text-slate-900",
                                                                            children: r.address || "-"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2970,
                                                                            columnNumber: 37
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-1.5 text-xs text-slate-600",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center justify-between",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            children: "Provinsi"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2976,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        isEditMode ? provinces.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                            value: shippingAreaStates[idx]?.provinceCode || "",
                                                                                            onChange: (e)=>void onShippingProvinceChange(idx, e.target.value),
                                                                                            className: "w-36 rounded border border-blue-300 px-1 py-0.5 text-xs",
                                                                                            disabled: isSaving,
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                    value: "",
                                                                                                    children: "Pilih Provinsi"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 2993,
                                                                                                    columnNumber: 45
                                                                                                }, this),
                                                                                                provinces.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                        value: p.code,
                                                                                                        children: p.name
                                                                                                    }, p.code, false, {
                                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                        lineNumber: 2997,
                                                                                                        columnNumber: 47
                                                                                                    }, this))
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 2979,
                                                                                            columnNumber: 43
                                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            value: r.province || "",
                                                                                            onChange: (e)=>updateEditedRow(r.id, "province", e.target.value),
                                                                                            className: "w-28 rounded border border-blue-300 px-1 py-0.5 text-xs",
                                                                                            disabled: isSaving
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 3006,
                                                                                            columnNumber: 43
                                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "font-semibold text-slate-900",
                                                                                            children: r.province || "-"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 3020,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 2975,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center justify-between",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            children: "Kabupaten/Kota"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 3026,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        isEditMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            value: r.city || "",
                                                                                            onChange: (e)=>updateEditedRow(r.id, "city", e.target.value),
                                                                                            className: "w-28 rounded border border-blue-300 px-1 py-0.5 text-xs",
                                                                                            disabled: isSaving
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 3028,
                                                                                            columnNumber: 41
                                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "font-semibold text-slate-900",
                                                                                            children: r.city || "-"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 3041,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 3025,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                isEditMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "flex items-center justify-between",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    children: "City"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 3049,
                                                                                                    columnNumber: 43
                                                                                                }, this),
                                                                                                provinces.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                                    value: shippingAreaStates[idx]?.regencyCode || "",
                                                                                                    onChange: (e)=>void onShippingRegencyChange(idx, e.target.value),
                                                                                                    className: "w-36 rounded border border-blue-300 px-1 py-0.5 text-xs",
                                                                                                    disabled: isSaving || !shippingAreaStates[idx]?.provinceCode,
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "",
                                                                                                            children: shippingAreaStates[idx]?.provinceCode ? "Pilih Kota/Kabupaten" : "Pilih provinsi dulu"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                            lineNumber: 3069,
                                                                                                            columnNumber: 47
                                                                                                        }, this),
                                                                                                        (shippingAreaStates[idx]?.regencies || []).map((regency)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                                value: regency.code,
                                                                                                                children: regency.name
                                                                                                            }, regency.code, false, {
                                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                                lineNumber: 3079,
                                                                                                                columnNumber: 49
                                                                                                            }, this))
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 3051,
                                                                                                    columnNumber: 45
                                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                    value: r.city || "",
                                                                                                    onChange: (e)=>updateEditedRow(r.id, "city", e.target.value),
                                                                                                    className: "w-28 rounded border border-blue-300 px-1 py-0.5 text-xs",
                                                                                                    disabled: isSaving
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 3088,
                                                                                                    columnNumber: 45
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 3048,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "flex items-center justify-between",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    children: "District"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 3103,
                                                                                                    columnNumber: 43
                                                                                                }, this),
                                                                                                provinces.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                                    value: (shippingAreaStates[idx]?.districts || []).find((x)=>normalizeName(x.name) === normalizeName(r.district))?.code || "",
                                                                                                    onChange: (e)=>onShippingDistrictChange(idx, e.target.value),
                                                                                                    className: "w-36 rounded border border-blue-300 px-1 py-0.5 text-xs",
                                                                                                    disabled: isSaving || !shippingAreaStates[idx]?.regencyCode,
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "",
                                                                                                            children: shippingAreaStates[idx]?.regencyCode ? "Pilih Kecamatan" : "Pilih kota dulu"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                            lineNumber: 3129,
                                                                                                            columnNumber: 47
                                                                                                        }, this),
                                                                                                        (shippingAreaStates[idx]?.districts || []).map((district)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                                value: district.code,
                                                                                                                children: district.name
                                                                                                            }, district.code, false, {
                                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                                lineNumber: 3139,
                                                                                                                columnNumber: 49
                                                                                                            }, this))
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 3105,
                                                                                                    columnNumber: 45
                                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                    value: r.district || "",
                                                                                                    onChange: (e)=>updateEditedRow(r.id, "district", e.target.value),
                                                                                                    className: "w-28 rounded border border-blue-300 px-1 py-0.5 text-xs",
                                                                                                    disabled: isSaving
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                    lineNumber: 3148,
                                                                                                    columnNumber: 45
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                            lineNumber: 3102,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "mt-2 border-t border-slate-200 pt-2",
                                                                                    children: isEditMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "space-y-1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                value: r.pic_name || "",
                                                                                                onChange: (e)=>updateEditedRow(r.id, "pic_name", e.target.value),
                                                                                                className: "w-full rounded border border-blue-300 px-1 py-0.5 text-xs",
                                                                                                placeholder: "PIC name",
                                                                                                disabled: isSaving
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 3167,
                                                                                                columnNumber: 43
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                value: r.pic_phone || "",
                                                                                                onChange: (e)=>updateEditedRow(r.id, "pic_phone", e.target.value),
                                                                                                className: "w-full rounded border border-blue-300 px-1 py-0.5 text-xs",
                                                                                                placeholder: "PIC phone",
                                                                                                disabled: isSaving
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 3180,
                                                                                                columnNumber: 43
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                        lineNumber: 3166,
                                                                                        columnNumber: 41
                                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "font-semibold text-slate-900",
                                                                                                children: [
                                                                                                    "PIC: ",
                                                                                                    r.pic_name || "-"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 3196,
                                                                                                columnNumber: 43
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "text-slate-500",
                                                                                                children: r.pic_phone || "-"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                                lineNumber: 3199,
                                                                                                columnNumber: 43
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 3164,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 2974,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, r.id, true, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 2929,
                                                                    columnNumber: 33
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 2920,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                    lineNumber: 2880,
                                                    columnNumber: 23
                                                }, this),
                                                activeTab === "contacts" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$branch_customer$2f$BCContactRelationsPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BCContactRelationsPanel"], {
                                                    branchCustomerId: bc.id
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                    lineNumber: 3215,
                                                    columnNumber: 23
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
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 3223,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 3222,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500",
                                                                                    children: "Created"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 3226,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-slate-500",
                                                                                    children: createdBy
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 3229,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 3225,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 3221,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-slate-800",
                                                                    children: dt(detail?.created_at || bc.created_at)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 3234,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 3220,
                                                            columnNumber: 25
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
                                                                                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                lineNumber: 3242,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 3241,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs font-semibold uppercase tracking-[0.24em] text-blue-500",
                                                                                    children: "Updated"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 3245,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-slate-500",
                                                                                    children: updatedBy
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                                    lineNumber: 3248,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                            lineNumber: 3244,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 3240,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-slate-800",
                                                                    children: dt(detail?.updated_at || bc.updated_at)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                                    lineNumber: 3253,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                            lineNumber: 3239,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                                    lineNumber: 3219,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                            lineNumber: 1969,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                    lineNumber: 1910,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                            lineNumber: 1892,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                        lineNumber: 1888,
                        columnNumber: 13
                    }, this),
                    showExitConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t border-amber-200 bg-amber-50 px-6 py-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold text-amber-900",
                                            children: "Ada perubahan yang belum disimpan."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                            lineNumber: 3268,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-amber-800",
                                            children: "Yakin mau keluar dari mode edit?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                            lineNumber: 3271,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                    lineNumber: 3267,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: closeDirectly,
                                            className: "rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100",
                                            children: "Lanjut Keluar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                            lineNumber: 3276,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setShowExitConfirm(false),
                                            className: "rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-700",
                                            children: "Batal"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                            lineNumber: 3283,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                    lineNumber: 3275,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                            lineNumber: 3266,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                        lineNumber: 3265,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                        className: "flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex w-full flex-col gap-3 sm:flex-row md:w-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: attemptClose,
                                    className: "w-full px-6 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 md:w-auto",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                    lineNumber: 3314,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>void applyEdit(),
                                    disabled: !isEditMode || isSaving || activeTab === "contacts",
                                    className: "w-full rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white disabled:opacity-50 md:w-auto",
                                    children: isSaving ? "Saving..." : "Apply Changes"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                                    lineNumber: 3321,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                            lineNumber: 3313,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                        lineNumber: 3295,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
                lineNumber: 1857,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
            lineNumber: 1853,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/branch_customer/BCDetailModal.tsx",
        lineNumber: 1851,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_branch_customer_297c1010._.js.map