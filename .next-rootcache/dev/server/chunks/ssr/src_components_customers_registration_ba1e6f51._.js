module.exports = [
"[project]/src/components/customers/registration/RegistrationCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RegistrationCard",
    ()=>RegistrationCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
function RegistrationCard({ registration, onViewDetails, onSync, isSyncing = false, syncLabel = "Sync", syncReadOnly = false, tourMode = false }) {
    const getStatusBadgeClass = (docstatus)=>{
        if (docstatus === 1) return "bg-green-100 text-green-700 border-green-200";
        if (docstatus === 2) return "bg-red-100 text-red-700 border-red-200";
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    };
    const getStatusLabel = (status)=>{
        return status.charAt(0).toUpperCase() + status.slice(1);
    };
    const formatSubmissionDate = (dateString)=>{
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
        } catch  {
            return dateString;
        }
    };
    const sagaStatus = (registration.sync_info?.saga_status || "").toLowerCase();
    const hasSagaStatus = Boolean(sagaStatus);
    const canShowSyncButton = Boolean(onSync) && hasSagaStatus && sagaStatus !== "completed";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        "data-tour": tourMode ? "customer-register-demo-card" : undefined,
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        whileHover: {
            y: -6,
            boxShadow: "0 20px 40px -10px rgba(239, 68, 68, 0.15)"
        },
        onClick: onViewDetails,
        className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gradient-to-br from-gray-50 via-white to-gray-50 p-5 border-b border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-3 mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaBuilding"], {
                                            className: "w-5 h-5 text-red-600"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                            lineNumber: 71,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                        lineNumber: 70,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate",
                                        children: registration.company.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                        lineNumber: 73,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 flex-shrink-0",
                                children: [
                                    !canShowSyncButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${getStatusBadgeClass(registration.docstatus)}`,
                                        children: getStatusLabel(registration.status)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                        lineNumber: 79,
                                        columnNumber: 15
                                    }, this),
                                    canShowSyncButton && onSync && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            if (!syncReadOnly && !isSyncing) onSync();
                                        },
                                        disabled: syncReadOnly || isSyncing,
                                        className: `inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${syncReadOnly ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"}`,
                                        title: syncReadOnly ? "Sinkronisasi sudah berhasil" : `${syncLabel} ke ERP/CRM/Ekaplus`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSyncAlt"], {
                                                className: isSyncing ? "animate-spin" : ""
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                                lineNumber: 106,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: isSyncing ? "Syncing..." : syncLabel
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                                lineNumber: 107,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                        lineNumber: 88,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 uppercase",
                                children: [
                                    "Source: ",
                                    registration.source || "-"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500 font-medium truncate",
                                children: registration.company.business_type
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-5 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUser"], {
                                className: "w-4 h-4 text-gray-400 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-gray-700 font-medium truncate",
                                children: registration.user.full_name
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {
                                className: "w-4 h-4 text-gray-400 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100",
                                children: [
                                    registration.company.branch_name,
                                    " (",
                                    registration.company.branch_city,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-2 border-t border-gray-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500 mb-1",
                                children: [
                                    "No Reg:",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-gray-700",
                                        children: registration.registration_number || registration.id
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                        lineNumber: 145,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500",
                                children: [
                                    "Submitted:",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-gray-700",
                                        children: formatSubmissionDate(registration.submission_date)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                        "data-tour": tourMode ? "customer-register-view-details" : undefined,
                        whileHover: {
                            scale: 1.02
                        },
                        whileTap: {
                            scale: 0.98
                        },
                        onClick: (e)=>{
                            e.stopPropagation();
                            onViewDetails();
                        },
                        className: "w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaEye"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "View Details"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/customers/registration/RegistrationCard.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/customers/registration/RejectRegistrationModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RejectRegistrationModal",
    ()=>RejectRegistrationModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$customerRegistration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/customerRegistration.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function normalizePhone(value) {
    if (!value) return undefined;
    const digits = value.replace(/\D/g, "");
    return digits || undefined;
}
function RejectRegistrationModal({ isOpen, onClose, registration, onSuccess }) {
    const { token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [selectedReason, setSelectedReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Reset form when modal opens with new registration
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen && registration) {
            setSelectedReason("");
            setNotes("");
            setError(null);
        }
    }, [
        isOpen,
        registration
    ]);
    const handleSubmit = async ()=>{
        if (!selectedReason) {
            setError("Silakan pilih alasan reject");
            return;
        }
        if (!registration || !token) {
            setError("Data tidak lengkap");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const selectedLabel = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$customerRegistration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REJECTION_REASONS"].find((r)=>r.code === selectedReason)?.label || selectedReason;
            const notesText = notes.trim();
            const shippingSpec = {
                fields: [
                    "*"
                ],
                filters: [
                    [
                        "parent_id",
                        "=",
                        Number(registration.id)
                    ],
                    [
                        "parent_type",
                        "=",
                        "customer_register"
                    ]
                ]
            };
            const shippingRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_REGISTER_ADDRESS, shippingSpec), {
                method: "GET",
                cache: "no-store"
            }, token);
            const shippingJson = shippingRes.ok ? await shippingRes.json().catch(()=>null) : null;
            const shippingRows = Array.isArray(shippingJson?.data) ? shippingJson.data : [];
            const effectiveShippingAddresses = registration.same_as_company_address ? shippingRows.length > 0 ? shippingRows : [
                {
                    id: -1,
                    parent_id: Number(registration.id),
                    label: "Alamat Perusahaan",
                    address: registration.address.full_address,
                    city: registration.address.city_name,
                    province: registration.address.province_name,
                    district: registration.address.district_name,
                    postal_code: registration.address.postal_code,
                    pic_name: registration.branch_owner?.full_name || registration.user.full_name,
                    pic_phone: registration.branch_owner?.phone || registration.user.phone,
                    is_default: 1
                }
            ] : shippingRows;
            const shippingPayload = effectiveShippingAddresses.map((addr)=>({
                    label: addr.label || "Warehouse",
                    pic_name: addr.pic_name || undefined,
                    pic_phone: normalizePhone(addr.pic_phone || undefined),
                    address: addr.address || "",
                    city: addr.city || "",
                    district: addr.district || "",
                    postal_code: addr.postal_code || "",
                    province: addr.province || "",
                    is_default: addr.is_default ? 1 : undefined
                }));
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_REGISTER}/${registration.id}`, {
                fields: [
                    "*"
                ]
            });
            const rawApplicantOwnerId = registration.ekaplus_user?.id;
            const applicantOwnerId = typeof rawApplicantOwnerId === "number" ? rawApplicantOwnerId : Number.parseInt(String(rawApplicantOwnerId || ""), 10);
            const fallbackOwnerId = Number(registration.created_by_id || 0) || Number(registration.user.user_id || 0);
            const payload = {
                owner: Number.isFinite(applicantOwnerId) && applicantOwnerId > 0 ? applicantOwnerId : fallbackOwnerId > 0 ? fallbackOwnerId : undefined,
                status: "Rejected",
                docstatus: 0,
                nbid: null,
                gpid: null,
                gcid: null,
                bcid: null,
                reject_reason: selectedLabel,
                reject_notes: notesText || null,
                rejection_reason: selectedLabel,
                rejection_notes: notesText || null,
                customer_shipping_address: shippingPayload
            };
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])(url, {
                method: "PUT",
                cache: "no-store",
                body: JSON.stringify(payload)
            }, token);
            if (!res.ok) {
                const json = await res.json().catch(()=>null);
                const message = json && typeof json === "object" && "message" in json && typeof json.message === "string" ? json.message : `Gagal reject registrasi (${res.status})`;
                throw new Error(message);
            }
            window.dispatchEvent(new Event("ekatalog:customer_registrations_update"));
            // Kirim message sukses ke parent, bukan handle sendiri
            onSuccess(`Registrasi "${registration.company.name}" berhasil di-reject.\nAlasan: ${selectedLabel}${notesText ? `\nCatatan: ${notesText}` : ""}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal reject registrasi");
        } finally{
            setIsSubmitting(false);
        }
    };
    if (!registration) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
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
                className: "bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTimesCircle"], {
                                className: "w-7 h-7 text-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                lineNumber: 222,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white",
                                        children: "Reject Registrasi Customer"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                        lineNumber: 224,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-red-100 mt-0.5",
                                        children: "Tolak pengajuan registrasi member"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                        lineNumber: 227,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                lineNumber: 223,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                        lineNumber: 221,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaExclamationTriangle"], {
                                        className: "w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                        lineNumber: 237,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold text-red-900",
                                                children: "Perhatian!"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                                lineNumber: 239,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-red-700 mt-1",
                                                children: [
                                                    "Anda akan menolak registrasi dari",
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold",
                                                        children: registration.company.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                                        lineNumber: 244,
                                                        columnNumber: 21
                                                    }, this),
                                                    ". Tindakan ini tidak dapat dibatalkan."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                                lineNumber: 242,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                        lineNumber: 238,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                lineNumber: 236,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                        children: [
                                            "Alasan Reject ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-500",
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                                lineNumber: 255,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                        lineNumber: 254,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedReason,
                                        onChange: (e)=>{
                                            setSelectedReason(e.target.value);
                                            setError(null);
                                        },
                                        className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all",
                                        disabled: isSubmitting,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "-- Pilih Alasan --"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                                lineNumber: 266,
                                                columnNumber: 19
                                            }, this),
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$customerRegistration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REJECTION_REASONS"].map((reason)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: reason.code,
                                                    children: reason.label
                                                }, reason.code, false, {
                                                    fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 21
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                        lineNumber: 257,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                lineNumber: 253,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                        children: "Catatan Tambahan (Opsional)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                        lineNumber: 277,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: notes,
                                        onChange: (e)=>setNotes(e.target.value),
                                        placeholder: "Tambahkan catatan atau penjelasan tambahan...",
                                        rows: 4,
                                        className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none",
                                        disabled: isSubmitting
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                        lineNumber: 280,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: "Catatan ini akan disimpan sebagai keterangan reject"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                        lineNumber: 288,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                lineNumber: 276,
                                columnNumber: 15
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaExclamationTriangle"], {
                                        className: "w-4 h-4 text-red-600 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                        lineNumber: 296,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-red-700 font-medium",
                                        children: error
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                        lineNumber: 297,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                lineNumber: 295,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                        lineNumber: 234,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                disabled: isSubmitting,
                                className: "px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                children: "Batal"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                lineNumber: 304,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                                whileHover: !isSubmitting ? {
                                    scale: 1.02
                                } : {},
                                whileTap: !isSubmitting ? {
                                    scale: 0.98
                                } : {},
                                onClick: handleSubmit,
                                disabled: isSubmitting,
                                className: "px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                                children: isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                            lineNumber: 321,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Memproses..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                            lineNumber: 322,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTimesCircle"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                            lineNumber: 326,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Reject Registrasi"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                            lineNumber: 327,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                                lineNumber: 312,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                        lineNumber: 303,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
                lineNumber: 214,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
            lineNumber: 213,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/customers/registration/RejectRegistrationModal.tsx",
        lineNumber: 211,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/customers/registration/CustomerRegistrationList.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomerRegistrationList",
    ()=>CustomerRegistrationList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$registration$2f$RegistrationCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/customers/registration/RegistrationCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$registration$2f$RegistrationDetailModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/customers/registration/RegistrationDetailModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$registration$2f$ApproveRegistrationModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/customers/registration/ApproveRegistrationModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$registration$2f$RejectRegistrationModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/customers/registration/RejectRegistrationModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ActionResultModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ActionResultModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$filters$2f$FilterBuilder$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/filters/FilterBuilder.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFilters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useFilters.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$filterFields$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/filterFields.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$paymentAccount$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/paymentAccount.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$customerRegistrationApproveTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/customerRegistrationApproveTour.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/driverTour.ts [app-ssr] (ecmascript)");
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
;
;
;
;
;
;
const SNAP_KEY = "ekatalog_customer_registrations_snapshot";
const DEFAULT_PAGE_SIZE = 20;
function resolveDisplayName(value) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return `User ${value}`;
    return undefined;
}
function resolveBranchId(value, fallback) {
    if (typeof fallback === "number" && Number.isFinite(fallback)) return fallback;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (value && typeof value === "object" && typeof value.id === "number") {
        return value.id;
    }
    return 0;
}
async function fetchNameMap(endpoint, ids, nameField, tokenValue) {
    const result = new Map();
    if (ids.length === 0) return result;
    try {
        const spec = {
            fields: [
                "id",
                "name",
                nameField
            ],
            filters: [
                [
                    "id",
                    "in",
                    ids
                ]
            ],
            limit: ids.length
        };
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(endpoint, spec), {
            method: "GET",
            cache: "no-store"
        }, tokenValue);
        if (!res.ok) return result;
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        for (const row of rows){
            const id = typeof row?.id === "number" ? row.id : Number.parseInt(String(row?.id ?? ""), 10);
            if (!Number.isFinite(id)) continue;
            const label = typeof row?.[nameField] === "string" && row[nameField] || typeof row?.name === "string" && row.name || undefined;
            if (label) result.set(id, label);
        }
    } catch  {
    // silent fallback to ID-only display
    }
    return result;
}
async function enrichMasterLinkNames(data, tokenValue) {
    const nbIds = Array.from(new Set(data.map((item)=>item.master_links?.nb_id).filter((v)=>typeof v === "number")));
    const gpIds = Array.from(new Set(data.map((item)=>item.master_links?.gp_id).filter((v)=>typeof v === "number")));
    const gcIds = Array.from(new Set(data.map((item)=>item.master_links?.gc_id).filter((v)=>typeof v === "number")));
    const bcIds = Array.from(new Set(data.map((item)=>item.master_links?.bc_id).filter((v)=>typeof v === "number")));
    const [nbMap, gpMap, gcMap, bcMap] = await Promise.all([
        fetchNameMap("/api/resource/national_brand", nbIds, "nb_name", tokenValue),
        fetchNameMap("/api/resource/group_parent", gpIds, "gp_name", tokenValue),
        fetchNameMap("/api/resource/group_customer", gcIds, "gc_name", tokenValue),
        fetchNameMap("/api/resource/branch_customer", bcIds, "name", tokenValue)
    ]);
    return data.map((item)=>{
        const links = item.master_links;
        if (!links) return item;
        const resolvedGcName = links.gc_name || (links.gc_id ? gcMap.get(links.gc_id) : undefined);
        const branchCity = item.company?.branch_city;
        const computedBcName = links.bc_name || (links.bc_id ? bcMap.get(links.bc_id) : undefined) || (resolvedGcName && branchCity ? `${resolvedGcName} - ${branchCity}` : undefined);
        return {
            ...item,
            master_links: {
                ...links,
                nb_name: links.nb_name || (links.nb_id ? nbMap.get(links.nb_id) : undefined),
                gp_name: links.gp_name || (links.gp_id ? gpMap.get(links.gp_id) : undefined),
                gc_name: resolvedGcName,
                bc_name: computedBcName
            }
        };
    });
}
function CustomerRegistrationList() {
    const { token, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [registrations, setRegistrations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadingMore, setLoadingMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedRegistration, setSelectedRegistration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedStatus, setSelectedStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [hasMore, setHasMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const loadMoreRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(null);
    // Sort state
    const [sortField, setSortField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("created_at");
    const [sortDirection, setSortDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("desc");
    const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Approve/Reject modals state
    const [isApproveModalOpen, setIsApproveModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedForAction, setSelectedForAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resultModal, setResultModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [syncingIds, setSyncingIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [rollbackingIds, setRollbackingIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [approveTourActive, setApproveTourActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tourRegistration, setTourRegistration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$customerRegistrationApproveTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customerRegistrationApproveTourDummy"]);
    const tourDriverRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const tourStartedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const tourRegistrationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$customerRegistrationApproveTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customerRegistrationApproveTourDummy"]);
    // Use filter system
    const { filters, setFilters } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFilters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFilters"])({
        entity: "customer_register"
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        tourRegistrationRef.current = tourRegistration;
    }, [
        tourRegistration
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timer = window.setTimeout(()=>{
            setDebouncedSearchQuery(searchQuery.trim());
        }, 300);
        return ()=>window.clearTimeout(timer);
    }, [
        searchQuery
    ]);
    // Map API response to frontend type
    function mapToFrontendType(apiData) {
        return {
            id: apiData.id.toString(),
            registration_number: apiData.name || apiData.id.toString(),
            source: apiData.source || undefined,
            ekaplus_user: apiData.ekaplus_user !== null && typeof apiData.ekaplus_user === "object" ? {
                id: apiData.ekaplus_user.id,
                full_name: apiData.ekaplus_user.full_name,
                email: apiData.ekaplus_user.email
            } : apiData.ekaplus_user ? {
                id: apiData.ekaplus_user
            } : undefined,
            // Owner info - extract from nested objects
            user: {
                user_id: apiData.owner || 0,
                full_name: apiData.owner_full_name || (apiData.owner ? `User ${apiData.owner}` : "Unknown User"),
                phone: apiData.owner_phone || "-",
                email: apiData.owner_email || "-",
                place_of_birth: apiData.owner_place_of_birth || "-",
                date_of_birth: apiData.owner_date_of_birth || "-"
            },
            // Company info - extract branch name from nested object
            company: {
                company_type: apiData.company_type || undefined,
                company_title: apiData.company_title || undefined,
                business_type: [
                    apiData.company_type,
                    apiData.company_title
                ].filter(Boolean).join(" - ") || "-",
                name: apiData.company_name || apiData.name,
                nik: "-",
                npwp: apiData.npwp || undefined,
                tax_status: Number(apiData.tax_status || 0),
                tax_status_label: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$paymentAccount$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTaxStatusLabel"])(apiData.tax_status),
                branch_id: resolveBranchId(apiData.branch_id, apiData.branch_id_id),
                branch_name: (apiData.branch_id && typeof apiData.branch_id === "object" ? apiData.branch_id.branch_name : undefined) || (resolveBranchId(apiData.branch_id, apiData.branch_id_id) ? `Branch ${resolveBranchId(apiData.branch_id, apiData.branch_id_id)}` : "-"),
                branch_city: (apiData.branch_id && typeof apiData.branch_id === "object" ? apiData.branch_id.city : undefined) || "-",
                product_need: apiData.product_need || undefined
            },
            // Address
            address: {
                full_address: apiData.company_address || "-",
                province_name: apiData.company_province || "-",
                city_name: apiData.company_city || "-",
                district_name: apiData.company_district || "-",
                village_name: apiData.company_village || "-",
                rt: "-",
                rw: "-",
                postal_code: apiData.company_postal_code || "-"
            },
            // Support data
            support_data: {
                contact_person: apiData.owner_full_name || undefined,
                company_email: apiData.owner_email || undefined,
                fax: undefined,
                factory_address: undefined,
                payment_method: apiData.payment_method || undefined,
                payment_account: apiData.payment_account || undefined,
                more_information: apiData.notes || undefined,
                sales_team: apiData.sales_team || undefined,
                erp_customer_group: apiData.erp_customer_group || undefined
            },
            branch_owner: {
                full_name: apiData.branch_owner || "-",
                phone: apiData.branch_owner_phone || "-",
                email: apiData.branch_owner_email || "-",
                place_of_birth: apiData.branch_owner_place_of_birth || undefined,
                date_of_birth: apiData.branch_owner_date_of_birth || undefined
            },
            master_links: {
                nb_id: apiData.nbid_link?.id ?? (typeof apiData.nbid === "object" ? apiData.nbid?.id : undefined) ?? apiData.nbid_id ?? (typeof apiData.nbid === "number" ? apiData.nbid : undefined) ?? undefined,
                nb_name: apiData.nbid_link?.nb_name ?? (typeof apiData.nbid === "object" ? apiData.nbid?.nb_name : undefined) ?? apiData.nbid_name ?? apiData.nbid_link?.name ?? (typeof apiData.nbid === "object" ? apiData.nbid?.name : undefined) ?? undefined,
                nb_manual: apiData.nb_manual || undefined,
                gp_id: apiData.gpid_link?.id ?? (typeof apiData.gpid === "object" ? apiData.gpid?.id : undefined) ?? apiData.gpid_id ?? (typeof apiData.gpid === "number" ? apiData.gpid : undefined) ?? undefined,
                gp_name: apiData.gpid_link?.gp_name ?? (typeof apiData.gpid === "object" ? apiData.gpid?.gp_name : undefined) ?? apiData.gpid_name ?? apiData.gpid_link?.name ?? (typeof apiData.gpid === "object" ? apiData.gpid?.name : undefined) ?? undefined,
                gp_manual: apiData.gp_manual || undefined,
                gc_id: apiData.gcid_link?.id ?? (typeof apiData.gcid === "object" ? apiData.gcid?.id : undefined) ?? apiData.gcid_id ?? (typeof apiData.gcid === "number" ? apiData.gcid : undefined) ?? undefined,
                gc_name: apiData.gcid_link?.gc_name ?? (typeof apiData.gcid === "object" ? apiData.gcid?.gc_name : undefined) ?? apiData.gcid_name ?? apiData.gcid_link?.name ?? (typeof apiData.gcid === "object" ? apiData.gcid?.name : undefined) ?? undefined,
                bc_id: apiData.bcid_link?.id ?? (typeof apiData.bcid === "object" ? apiData.bcid?.id : undefined) ?? apiData.bcid_id ?? (typeof apiData.bcid === "number" ? apiData.bcid : undefined) ?? undefined,
                bc_name: apiData.bcid_link?.bc_name ?? (typeof apiData.bcid === "object" ? apiData.bcid?.bc_name : undefined) ?? apiData.bcid_name ?? apiData.bcid_link?.name ?? (typeof apiData.bcid === "object" ? apiData.bcid?.name : undefined) ?? undefined
            },
            sync_info: {
                saga_status: apiData.saga_status ?? undefined,
                sync_saga_id: apiData.sync_saga_id ?? undefined,
                erp_customer_id: apiData.erp_customer_id ?? undefined,
                crm_customer_id: apiData.crm_customer_id ?? undefined,
                sync_last_error: apiData.sync_last_error ?? undefined,
                sync_last_rollback_error: apiData.sync_last_rollback_error ?? undefined
            },
            same_as_company_address: Boolean(apiData.same_as_company_address),
            shipping_addresses: [],
            // Documents
            documents: {
                ktp_photo: undefined,
                npwp_photo: undefined
            },
            // Status - map to lowercase for consistency
            status: apiData.status.toLowerCase(),
            docstatus: typeof apiData.docstatus === "number" ? apiData.docstatus : Number(apiData.docstatus || 0),
            submission_date: apiData.created_at,
            created_at: apiData.created_at,
            created_by_id: typeof apiData.created_by === "number" ? apiData.created_by : typeof apiData.created_by === "object" && typeof apiData.created_by?.id === "number" ? apiData.created_by.id : undefined,
            created_by: (apiData.source || "").toLowerCase() === "crm" ? resolveDisplayName(apiData.crm_user) || (typeof apiData.created_by === "object" && apiData.created_by?.full_name ? apiData.created_by.full_name : apiData["created_by.full_name"] ? apiData["created_by.full_name"] : typeof apiData.created_by === "number" ? `User ${apiData.created_by}` : undefined) : typeof apiData.created_by === "object" && apiData.created_by?.full_name ? apiData.created_by.full_name : apiData["created_by.full_name"] ? apiData["created_by.full_name"] : typeof apiData.created_by === "number" ? `User ${apiData.created_by}` : undefined,
            updated_at: apiData.updated_at,
            updated_by_id: typeof apiData.updated_by === "number" ? apiData.updated_by : typeof apiData.updated_by === "object" && typeof apiData.updated_by?.id === "number" ? apiData.updated_by.id : undefined,
            updated_by: typeof apiData.updated_by === "object" && apiData.updated_by?.full_name ? apiData.updated_by.full_name : apiData["updated_by.full_name"] ? apiData["updated_by.full_name"] : typeof apiData.updated_by === "number" ? `User ${apiData.updated_by}` : undefined,
            gp_id: apiData.gpid_link?.id ?? (typeof apiData.gpid === "object" ? apiData.gpid?.id : undefined) ?? apiData.gpid_id ?? (typeof apiData.gpid === "number" ? apiData.gpid : undefined) ?? undefined,
            gp_name: apiData.gpid_link?.gp_name ?? (typeof apiData.gpid === "object" ? apiData.gpid?.gp_name : undefined) ?? apiData.gpid_name ?? apiData.gpid_link?.name ?? (typeof apiData.gpid === "object" ? apiData.gpid?.name : undefined) ?? undefined,
            gc_id: apiData.gcid_link?.id ?? (typeof apiData.gcid === "object" ? apiData.gcid?.id : undefined) ?? apiData.gcid_id ?? (typeof apiData.gcid === "number" ? apiData.gcid : undefined) ?? undefined,
            gc_name: apiData.gcid_link?.gc_name ?? (typeof apiData.gcid === "object" ? apiData.gcid?.gc_name : undefined) ?? apiData.gcid_name ?? apiData.gcid_link?.name ?? (typeof apiData.gcid === "object" ? apiData.gcid?.name : undefined) ?? undefined,
            bc_id: apiData.bcid_link?.id ?? (typeof apiData.bcid === "object" ? apiData.bcid?.id : undefined) ?? apiData.bcid_id ?? (typeof apiData.bcid === "number" ? apiData.bcid : undefined) ?? undefined,
            bc_name: apiData.bcid_link?.bc_name ?? (typeof apiData.bcid === "object" ? apiData.bcid?.bc_name : undefined) ?? apiData.bcid_name ?? apiData.bcid_link?.name ?? (typeof apiData.bcid === "object" ? apiData.bcid?.name : undefined) ?? undefined,
            rejection_reason: apiData.reject_reason ?? apiData.rejection_reason ?? undefined,
            rejection_notes: apiData.reject_notes ?? undefined
        };
    }
    // Function to load data with filters and sorting
    const loadDataWithFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (page, replace = false, filterTriples = [], sort_by, sort_order)=>{
        if (replace) {
            setLoading(true);
            setError(null);
        } else {
            setLoadingMore(true);
        }
        try {
            if (!isAuthenticated || !token) {
                setRegistrations([]);
                setHasMore(false);
                setLoading(false);
                setLoadingMore(false);
                return;
            }
            // Build spec for query - include nested fields, filters, and sorting
            const spec = {
                fields: [
                    "*",
                    "branch_id.branch_name",
                    "branch_id.city",
                    "created_by.full_name",
                    "updated_by.full_name"
                ],
                page
            };
            const defaultFilters = [
                [
                    "status",
                    "!=",
                    "Draft"
                ]
            ];
            const mergedFilters = filterTriples.length > 0 ? [
                ...defaultFilters,
                ...filterTriples
            ] : defaultFilters;
            spec.filters = selectedStatus !== "all" ? [
                ...mergedFilters,
                [
                    "status",
                    "=",
                    selectedStatus
                ]
            ] : mergedFilters;
            // Add server-side sorting
            if (sort_by && sort_order) {
                spec.order_by = [
                    [
                        sort_by,
                        sort_order
                    ]
                ];
            }
            if (debouncedSearchQuery) {
                spec.search = debouncedSearchQuery;
            }
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_REGISTER, spec);
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])(url, {
                method: "GET",
                cache: "no-store"
            }, token);
            if (res.ok) {
                const response = await res.json();
                const apiData = response.data || [];
                const mapped = apiData.map((item)=>mapToFrontendType(item));
                const enrichedPage = await enrichMasterLinkNames(mapped, token);
                const perPage = Number(response?.meta?.per_page || DEFAULT_PAGE_SIZE);
                let nextRegistrations = [];
                setRegistrations((current)=>nextRegistrations = replace ? enrichedPage : [
                        ...current,
                        ...enrichedPage.filter((item)=>!current.some((existing)=>existing.id === item.id))
                    ]);
                setCurrentPage(page);
                setHasMore(enrichedPage.length >= perPage);
                try {
                    localStorage.setItem(SNAP_KEY, JSON.stringify(nextRegistrations));
                } catch  {}
            } else {
                setError(`Failed to fetch registrations (${res.status})`);
                setHasMore(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            if (replace) setRegistrations([]);
            setHasMore(false);
        } finally{
            if (replace) setLoading(false);
            else setLoadingMore(false);
        }
    }, [
        debouncedSearchQuery,
        isAuthenticated,
        selectedStatus,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setCurrentPage(1);
        setHasMore(true);
        void loadDataWithFilters(1, true, filters, sortField, sortDirection);
    }, [
        debouncedSearchQuery,
        filters,
        loadDataWithFilters,
        selectedStatus,
        sortField,
        sortDirection
    ]);
    const refreshList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setCurrentPage(1);
        setHasMore(true);
        await loadDataWithFilters(1, true, filters, sortField, sortDirection);
    }, [
        filters,
        loadDataWithFilters,
        sortField,
        sortDirection
    ]);
    // Listen for updates - reload from API when triggered
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function handler() {
            await refreshList();
        }
        window.addEventListener("ekatalog:customer_registrations_update", handler);
        return ()=>window.removeEventListener("ekatalog:customer_registrations_update", handler);
    }, [
        refreshList
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const target = loadMoreRef.current;
        if (!target || loading || loadingMore || !hasMore) return;
        const observer = new IntersectionObserver((entries)=>{
            if (!entries[0]?.isIntersecting) return;
            void loadDataWithFilters(currentPage + 1, false, filters, sortField, sortDirection);
        }, {
            root: null,
            rootMargin: "240px 0px",
            threshold: 0
        });
        observer.observe(target);
        return ()=>observer.disconnect();
    }, [
        currentPage,
        filters,
        hasMore,
        loadDataWithFilters,
        loading,
        loadingMore,
        sortField,
        sortDirection
    ]);
    // Handle filter apply
    const handleApplyFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newFilters)=>{
        setFilters(newFilters);
    }, [
        setFilters
    ]);
    // Filter locally based on search and status
    const filteredRegistrations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const liveRows = [
            ...registrations
        ];
        if (!approveTourActive) return liveRows;
        return [
            tourRegistration,
            ...liveRows.filter((item)=>item.id !== tourRegistration.id)
        ];
    }, [
        approveTourActive,
        registrations,
        tourRegistration
    ]);
    const handleViewDetails = (registration)=>{
        setSelectedRegistration(registration);
        setIsDetailModalOpen(true);
    };
    const handleSearchChange = (query)=>{
        setSearchQuery(query);
    };
    // Approve/Reject action handlers
    const handleApprove = (registration)=>{
        setSelectedForAction(registration);
        setIsDetailModalOpen(false); // Close detail modal
        setIsApproveModalOpen(true);
    };
    const handleReject = (registration)=>{
        setSelectedForAction(registration);
        setIsDetailModalOpen(false); // Close detail modal
        setIsRejectModalOpen(true);
    };
    const handleStartApproveTour = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (approveTourActive) return;
        setApproveTourActive(true);
    }, [
        approveTourActive
    ]);
    const handleDemoRegistrationChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((nextRegistration)=>{
        setTourRegistration(nextRegistration);
        setSelectedRegistration((current)=>current?.id === nextRegistration.id ? nextRegistration : current);
        setSelectedForAction((current)=>current?.id === nextRegistration.id ? nextRegistration : current);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!approveTourActive || tourStartedRef.current) return;
        let cancelled = false;
        const driveTour = async ()=>{
            const card = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForElement"])("[data-tour='customer-register-demo-card']");
            if (!card || cancelled) return;
            const goToNextStep = async (selector, clickSelector)=>{
                if (clickSelector) {
                    document.querySelector(clickSelector)?.click();
                }
                const target = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForElement"])(selector, {
                    timeout: 5000
                });
                if (!target || cancelled) return;
                tourDriverRef.current?.moveNext();
            };
            const goToPreviousStep = async (selector, action, clickSelector)=>{
                action?.();
                if (clickSelector) {
                    document.querySelector(clickSelector)?.click();
                }
                const target = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForElement"])(selector, {
                    timeout: 5000
                });
                if (!target || cancelled) return;
                tourDriverRef.current?.movePrevious();
            };
            const setInputValue = (selector, value)=>{
                const input = document.querySelector(selector);
                if (!input) return;
                const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
                nativeSetter?.call(input, value);
                input.dispatchEvent(new Event("input", {
                    bubbles: true
                }));
            };
            const showGpExistingSelection = async ()=>{
                setInputValue("[data-tour='approve-registration-gp-search-input']", "A 2 SOFA GROUP");
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForElement"])("[data-tour^='approve-registration-gp-result-']", {
                    timeout: 5000
                });
                result?.click();
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForElement"])("[data-tour='approve-registration-gp-selected-badge']", {
                    timeout: 5000
                });
            };
            const showGpCreateOption = async ()=>{
                document.querySelector("[data-tour='approve-registration-gp-change-button']")?.click();
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForElement"])("[data-tour='approve-registration-gp-search-input']", {
                    timeout: 5000
                });
                setInputValue("[data-tour='approve-registration-gp-search-input']", "DEMO SEJAHTERA ABADI GROUP");
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForElement"])("[data-tour='approve-registration-gp-create-trigger']", {
                    timeout: 5000
                });
            };
            const showGpCreatePanel = async ()=>{
                document.querySelector("[data-tour='approve-registration-gp-create-trigger']")?.click();
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForElement"])("[data-tour='approve-registration-gp-create-input']", {
                    timeout: 5000
                });
            };
            tourDriverRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDriverTour"])({
                onDestroyed: ()=>{
                    setApproveTourActive(false);
                    setIsDetailModalOpen(false);
                    setIsApproveModalOpen(false);
                    setSelectedRegistration(null);
                    setSelectedForAction(null);
                    tourStartedRef.current = false;
                    tourDriverRef.current = null;
                },
                steps: [
                    {
                        element: "[data-tour='customer-register-demo-card']",
                        popover: {
                            title: "Data Dummy Registrasi",
                            description: "Panduan ini memakai data contoh agar bisa dijalankan kapan saja.",
                            side: "left",
                            align: "start"
                        }
                    },
                    {
                        element: "[data-tour='customer-register-view-details']",
                        popover: {
                            title: "Masuk ke Detail Registrasi",
                            description: "                Klik View Details untuk membuka rincian pengajuan customer.",
                            side: "right",
                            align: "center",
                            onNextClick: ()=>{
                                setSelectedRegistration(tourRegistrationRef.current);
                                setIsDetailModalOpen(true);
                                void goToNextStep("[data-tour='customer-register-detail-modal']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='customer-register-detail-modal']",
                        popover: {
                            title: "Review Informasi Customer",
                            description: "Cek terlebih dahulu identitas pemilik, identitas perusahaan, alamat dan data pendukung lainnya sebelum memutuskan untuk approve atau reject.",
                            side: "left",
                            align: "start",
                            onPrevClick: ()=>{
                                setIsDetailModalOpen(false);
                                void goToPreviousStep("[data-tour='customer-register-view-details']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='customer-register-edit-button']",
                        popover: {
                            title: "Perbaiki Penamaan Jika Belum Sesuai",
                            description: "Kalau nama perusahaan belum sesuai konsep penamaan, buka menu Edit dulu sebelum masuk ke flow approve.",
                            side: "top",
                            align: "center",
                            onPrevClick: ()=>{
                                void tourDriverRef.current?.movePrevious();
                            },
                            onNextClick: ()=>{
                                document.querySelector("[data-tour='customer-register-edit-button']")?.click();
                                void goToNextStep("[data-tour='customer-register-edit-modal']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='customer-register-company-name-input']",
                        popover: {
                            title: "Sesuaikan Nama Perusahaan",
                            description: "Ubah nama menjadi DEMO SEJAHTERA ABADI. Suffix TK tetap dipakai karena sudah mewakili Toko, jadi tidak perlu kata Toko di depan.",
                            side: "bottom",
                            align: "start",
                            onPrevClick: ()=>{
                                void (async ()=>{
                                    document.querySelector("[data-tour='customer-register-close-edit-button']")?.click();
                                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForElementToDisappear"])("[data-tour='customer-register-edit-modal']", {
                                        timeout: 5000
                                    });
                                    await goToPreviousStep("[data-tour='customer-register-edit-button']");
                                })();
                            },
                            onNextClick: ()=>{
                                const input = document.querySelector("[data-tour='customer-register-company-name-input']");
                                if (input) {
                                    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
                                    nativeSetter?.call(input, "DEMO SEJAHTERA ABADI");
                                    input.dispatchEvent(new Event("input", {
                                        bubbles: true
                                    }));
                                }
                                void goToNextStep("[data-tour='customer-register-save-edit-button']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='customer-register-save-edit-button']",
                        popover: {
                            title: "Simpan Perubahan",
                            description: "Kalau penamaannya sudah sesuai, simpan perubahan terlebih dahulu baru lanjutkan proses approve.",
                            side: "top",
                            align: "center",
                            onPrevClick: ()=>{
                                void goToPreviousStep("[data-tour='customer-register-company-name-input']");
                            },
                            onNextClick: ()=>{
                                void (async ()=>{
                                    document.querySelector("[data-tour='customer-register-save-edit-button']")?.click();
                                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForElementToDisappear"])("[data-tour='customer-register-edit-modal']", {
                                        timeout: 5000
                                    });
                                    await goToNextStep("[data-tour='customer-register-approve-button']");
                                })();
                            }
                        }
                    },
                    {
                        element: "[data-tour='customer-register-approve-button']",
                        popover: {
                            title: "Lanjut ke Flow Approve",
                            description: "Setelah semua data perusahaan sudah sesuai dan tidak ada yang ingin diedit lagi, klik Approve untuk melanjutkan proses registrasi customer.",
                            side: "top",
                            align: "center",
                            onPrevClick: ()=>{
                                void goToPreviousStep("[data-tour='customer-register-save-edit-button']");
                            },
                            onNextClick: ()=>{
                                setSelectedForAction(tourRegistrationRef.current);
                                setIsDetailModalOpen(false);
                                setIsApproveModalOpen(true);
                                void goToNextStep("[data-tour='approve-registration-modal']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-demo-banner']",
                        popover: {
                            title: "Mode Demo Aman",
                            description: "Selama tour aktif, semua request create dan approve disimulasikan. Tidak ada data asli yang diubah.",
                            side: "bottom",
                            align: "start",
                            onPrevClick: ()=>{
                                setIsApproveModalOpen(false);
                                setSelectedForAction(null);
                                setSelectedRegistration(tourRegistrationRef.current);
                                setIsDetailModalOpen(true);
                                void goToPreviousStep("[data-tour='customer-register-approve-button']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-step-1']",
                        popover: {
                            title: "Step 1: National Brand",
                            description: "Step ini opsional. Approver bisa memilih NB existing atau lanjut tanpa NB jika memang tidak diperlukan.",
                            side: "left",
                            align: "start"
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-next-button']",
                        popover: {
                            title: "Lanjut ke Step Berikutnya",
                            description: "Jika sudah selesai dibagian National Brand, klik Next untuk melanjutkan ke Step Selanjutnya.",
                            side: "top",
                            align: "end",
                            onNextClick: ()=>{
                                void goToNextStep("[data-tour='approve-registration-step-2']", "[data-tour='approve-registration-next-button']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-step-2']",
                        popover: {
                            title: "Step 2: Group Parent",
                            description: "Di sini approver memetakan customer ke Group Parent yang existing atau membuat GP baru bila belum ada.",
                            side: "left",
                            align: "start",
                            onPrevClick: ()=>{
                                void goToPreviousStep("[data-tour='approve-registration-next-button']", undefined, "[data-tour='approve-registration-prev-button']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-gp-search-input']",
                        popover: {
                            title: "Cari Group Parent Existing",
                            description: "Kalau sudah ada Group Parent yang sesuai, ketik nama atau kodenya lalu pilih dari hasil pencarian.",
                            side: "bottom",
                            align: "start",
                            onNextClick: ()=>{
                                document.querySelector("[data-tour^='approve-registration-gp-result-']")?.click();
                                void goToNextStep("[data-tour='approve-registration-gp-selected-badge']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-gp-selected-badge']",
                        popover: {
                            title: "Hasil Jika GP Existing Dipilih",
                            description: "Jika Group Parent yang dicari sudah ada, hasilnya akan tampil seperti ini. User masih bisa klik Ganti bila ingin mencari atau membuat GP lain.",
                            side: "top",
                            align: "start",
                            onPrevClick: ()=>{
                                void goToPreviousStep("[data-tour='approve-registration-gp-search-input']", ()=>{
                                    document.querySelector("[data-tour='approve-registration-gp-change-button']")?.click();
                                });
                            },
                            onNextClick: ()=>{
                                void (async ()=>{
                                    await showGpCreateOption();
                                    tourDriverRef.current?.moveNext();
                                })();
                            }
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-gp-create-trigger']",
                        popover: {
                            title: "Jika Ingin Membuat Group Parent Baru",
                            description: "Kalau hasil pencarian tidak menemukan GP yang cocok, klik Buat GP Baru untuk membuka form pembuatan Group Parent.",
                            side: "top",
                            align: "center",
                            onPrevClick: ()=>{
                                void (async ()=>{
                                    await showGpExistingSelection();
                                    tourDriverRef.current?.movePrevious();
                                })();
                            },
                            onNextClick: ()=>{
                                void (async ()=>{
                                    await showGpCreatePanel();
                                    tourDriverRef.current?.moveNext();
                                })();
                            }
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-gp-create-input']",
                        popover: {
                            title: "Isi Form Group Parent Baru",
                            description: "Di form ini user mengisi nama Group Parent baru. Pada demo ini nama otomatis mengikuti pencarian yang tadi tidak ditemukan.",
                            side: "bottom",
                            align: "start",
                            onPrevClick: ()=>{
                                void (async ()=>{
                                    document.querySelector("[data-tour='approve-registration-gp-create-cancel']")?.click();
                                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$driverTour$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForElement"])("[data-tour='approve-registration-gp-create-trigger']", {
                                        timeout: 5000
                                    });
                                    tourDriverRef.current?.movePrevious();
                                })();
                            },
                            onNextClick: ()=>{
                                void goToNextStep("[data-tour='approve-registration-step-3']", "[data-tour='approve-registration-next-button']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-step-3']",
                        popover: {
                            title: "Step 3: Group Customer",
                            description: "Setelah GP siap, approver menentukan Group Customer yang terkait dengan perusahaan pendaftar.",
                            side: "left",
                            align: "start",
                            onPrevClick: ()=>{
                                void goToPreviousStep("[data-tour='approve-registration-gp-create-panel']", undefined, "[data-tour='approve-registration-prev-button']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-next-button']",
                        popover: {
                            title: "Lanjut ke Branch Customer",
                            description: "Jika bagian Group Customer sudah sesuai, klik Next untuk melanjutkan ke Step Branch Customer.",
                            side: "top",
                            align: "end",
                            onNextClick: ()=>{
                                void goToNextStep("[data-tour='approve-registration-step-4']", "[data-tour='approve-registration-next-button']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-step-4']",
                        popover: {
                            title: "Step 4: Branch Customer",
                            description: "Di step ini approver menentukan apakah Branch Customer memakai data existing atau dibuat baru dari hasil approval.",
                            side: "left",
                            align: "start",
                            onPrevClick: ()=>{
                                void goToPreviousStep("[data-tour='approve-registration-step-3']", undefined, "[data-tour='approve-registration-prev-button']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-next-button']",
                        popover: {
                            title: "Masuk ke Final Review",
                            description: "Tombol ini membawa approver ke ringkasan akhir sebelum commit approve.",
                            side: "top",
                            align: "end",
                            onNextClick: ()=>{
                                void goToNextStep("[data-tour='approve-registration-step-5']", "[data-tour='approve-registration-next-button']");
                            }
                        }
                    },
                    {
                        element: "[data-tour='approve-registration-commit-button']",
                        popover: {
                            title: "Final Commit Approve",
                            description: "Di produksi, tombol ini akan mengubah status register ke Syncing. Di mode demo, aksi ini hanya simulasi.",
                            side: "top",
                            align: "center",
                            onPrevClick: ()=>{
                                void goToPreviousStep("[data-tour='approve-registration-next-button']", undefined, "[data-tour='approve-registration-prev-button']");
                            }
                        }
                    }
                ]
            });
            tourStartedRef.current = true;
            tourDriverRef.current.drive();
        };
        void driveTour();
        return ()=>{
            cancelled = true;
            tourDriverRef.current?.destroy();
        };
    }, [
        approveTourActive
    ]);
    const handleApproveSuccess = (message)=>{
        const active = selectedForAction;
        const gpLine = message.match(/GROUP PARENT:\s*(.+)/)?.[1]?.trim() || message.match(/GP ID:\s*(.+)/)?.[1]?.trim() || "-";
        const gcLine = message.match(/GROUP CUSTOMER:\s*(.+)/)?.[1]?.trim() || message.match(/GC ID:\s*(.+)/)?.[1]?.trim() || "-";
        const bcLine = message.match(/BRANCH CUSTOMER:\s*(.+)/)?.[1]?.trim() || message.match(/BC ID:\s*(.+)/)?.[1]?.trim() || "-";
        setIsApproveModalOpen(false);
        setSelectedForAction(null);
        setResultModal({
            isOpen: true,
            type: "success",
            title: "Syncing Dipicu",
            message: `Registrasi "${active?.company.name || "-"}" berhasil masuk status Syncing`,
            description: "Data customer sedang diproses sinkronisasi melalui Saga.",
            details: [
                {
                    label: "ID Pelanggan",
                    value: active?.registration_number || "-"
                },
                {
                    label: "Group Parent",
                    value: gpLine
                },
                {
                    label: "Group Customer",
                    value: gcLine
                },
                {
                    label: "Branch Customer",
                    value: bcLine
                }
            ]
        });
    };
    const handleRejectSuccess = (message)=>{
        const active = selectedForAction;
        const rejectReason = message.match(/Alasan:\s*(.+)/)?.[1]?.trim() || "-";
        const rejectNotes = message.match(/Catatan:\s*(.+)/)?.[1]?.trim() || "-";
        setIsRejectModalOpen(false);
        setSelectedForAction(null);
        setResultModal({
            isOpen: true,
            type: "error",
            title: "Customer di Reject",
            message: `Registrasi "${active?.company.name || "-"}" Ditolak`,
            description: "Data customer ditolak dan belum dapat diproses ke tahap berikutnya.",
            details: [
                {
                    label: "Reject Reason",
                    value: rejectReason
                },
                {
                    label: "Reject Notes",
                    value: rejectNotes
                }
            ]
        });
    };
    const getSyncLabel = (registration)=>{
        const saga = (registration.sync_info?.saga_status || "").toLowerCase();
        if (!saga || saga === "completed") return "Sync";
        return "Resync";
    };
    const isSyncReadOnly = (registration)=>{
        const saga = (registration.sync_info?.saga_status || "").toLowerCase();
        return saga === "completed";
    };
    const handleSync = async (registration)=>{
        if (!token) return;
        if (isSyncReadOnly(registration)) return;
        setSyncingIds((prev)=>({
                ...prev,
                [registration.id]: true
            }));
        try {
            const sagaId = registration.sync_info?.sync_saga_id;
            if (!sagaId) {
                throw new Error("saga_id tidak tersedia pada customer_register");
            }
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].BASE_URL}/api/saga/recover`, {
                method: "POST",
                cache: "no-store",
                body: JSON.stringify({
                    status: "Syncing",
                    saga_id: sagaId
                })
            }, token);
            if (!response.ok) {
                let serverMessage = "";
                try {
                    const json = await response.json();
                    if (json?.message && typeof json.message === "string") {
                        serverMessage = json.message;
                    }
                } catch  {}
                throw new Error(`HTTP ${response.status}${serverMessage ? `: ${serverMessage}` : ""}`);
            }
            await refreshList();
            setResultModal({
                isOpen: true,
                type: "success",
                title: `${getSyncLabel(registration)} Berhasil`,
                message: `Sinkronisasi untuk "${registration.company.name}" berhasil dijalankan.`,
                description: "Data sync ke ERP/CRM/Ekaplus sudah dipicu. Silakan cek Saga Status terbaru."
            });
        } catch (errorSync) {
            setResultModal({
                isOpen: true,
                type: "error",
                title: `${getSyncLabel(registration)} Gagal`,
                message: errorSync instanceof Error ? errorSync.message : "Terjadi kesalahan saat sinkronisasi."
            });
        } finally{
            setSyncingIds((prev)=>({
                    ...prev,
                    [registration.id]: false
                }));
        }
    };
    const handleRollback = async (registration)=>{
        if (!token) return;
        setRollbackingIds((prev)=>({
                ...prev,
                [registration.id]: true
            }));
        try {
            const sagaId = registration.sync_info?.sync_saga_id;
            if (!sagaId) {
                throw new Error("saga_id tidak tersedia pada customer_register");
            }
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].BASE_URL}/api/saga/force-rollback`, {
                method: "POST",
                cache: "no-store",
                body: JSON.stringify({
                    status: "Syncing",
                    saga_id: sagaId
                })
            }, token);
            if (!response.ok) {
                let serverMessage = "";
                try {
                    const json = await response.json();
                    if (json?.message && typeof json.message === "string") {
                        serverMessage = json.message;
                    }
                } catch  {}
                throw new Error(`HTTP ${response.status}${serverMessage ? `: ${serverMessage}` : ""}`);
            }
            await refreshList();
            setResultModal({
                isOpen: true,
                type: "success",
                title: "Rollback Berhasil",
                message: `Rollback untuk "${registration.company.name}" berhasil dijalankan.`,
                description: "Force rollback dipicu. Silakan cek Saga Status terbaru di detail sinkronisasi."
            });
        } catch (errorRollback) {
            setResultModal({
                isOpen: true,
                type: "error",
                title: "Rollback Gagal",
                message: errorRollback instanceof Error ? errorRollback.message : "Terjadi kesalahan saat rollback."
            });
        } finally{
            setRollbackingIds((prev)=>({
                    ...prev,
                    [registration.id]: false
                }));
        }
    };
    // Loading state
    if (loading && registrations.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center py-20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1568,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 font-medium",
                        children: "Memuat data registrasi..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1569,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                lineNumber: 1567,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
            lineNumber: 1566,
            columnNumber: 7
        }, this);
    }
    // Error state
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-8 text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-5 h-5",
                        fill: "currentColor",
                        viewBox: "0 0 20 20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            fillRule: "evenodd",
                            d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                            clipRule: "evenodd"
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                            lineNumber: 1583,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1582,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium",
                        children: [
                            "Error: ",
                            error
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1589,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                lineNumber: 1581,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
            lineNumber: 1580,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl md:text-3xl font-bold text-gray-800 mb-2",
                                children: "Customer Registrations"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                lineNumber: 1600,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm md:text-base text-gray-600",
                                children: "Kelola pengajuan registrasi member dari customer"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                lineNumber: 1603,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1599,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleStartApproveTour,
                        disabled: approveTourActive,
                        className: "inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPlayCircle"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                lineNumber: 1613,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Tour Approve Customer Register"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                lineNumber: 1614,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1607,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                lineNumber: 1598,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col md:flex-row gap-4 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSearch"], {
                                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                    lineNumber: 1664,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: searchQuery,
                                    onChange: (e)=>handleSearchChange(e.target.value),
                                    placeholder: "Cari perusahaan, pemilik, tipe bisnis, atau cabang...",
                                    className: "w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                    lineNumber: 1665,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                            lineNumber: 1663,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center gap-3 border-t border-gray-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$filters$2f$FilterBuilder$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    entity: "customer_register",
                                    config: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$filterFields$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CUSTOMER_REGISTER_FILTER_FIELDS"],
                                    onApply: handleApplyFilters
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                    lineNumber: 1690,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        const newDirection = sortDirection === "asc" ? "desc" : "asc";
                                        setSortDirection(newDirection);
                                    },
                                    className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200",
                                    title: sortDirection === "asc" ? "Ascending (A-Z, 1-9, Oldest)" : "Descending (Z-A, 9-1, Newest)",
                                    children: sortDirection === "asc" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSortAmountUp"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                        lineNumber: 1710,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSortAmountDown"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                        lineNumber: 1712,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                    lineNumber: 1697,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSortFieldDropdownOpen(!sortFieldDropdownOpen),
                                            className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        sortField === "company_name" && "Nama Perusahaan",
                                                        sortField === "created_at" && "Tanggal Dibuat",
                                                        sortField === "updated_at" && "Tanggal Diupdate",
                                                        sortField === "status" && "Status",
                                                        sortField === "company_type" && "Tipe Bisnis"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                                    lineNumber: 1722,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaChevronDown"], {
                                                    className: `w-3 h-3 transition-transform ${sortFieldDropdownOpen ? "rotate-180" : ""}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                                    lineNumber: 1729,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                            lineNumber: 1718,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                            children: sortFieldDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "fixed inset-0 z-10",
                                                        onClick: ()=>setSortFieldDropdownOpen(false)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                                        lineNumber: 1739,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                        initial: {
                                                            opacity: 0,
                                                            y: -10
                                                        },
                                                        animate: {
                                                            opacity: 1,
                                                            y: 0
                                                        },
                                                        exit: {
                                                            opacity: 0,
                                                            y: -10
                                                        },
                                                        className: "absolute top-full rigth-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px] z-20",
                                                        children: [
                                                            {
                                                                value: "company_name",
                                                                label: "Nama Perusahaan"
                                                            },
                                                            {
                                                                value: "created_at",
                                                                label: "Tanggal Dibuat"
                                                            },
                                                            {
                                                                value: "updated_at",
                                                                label: "Tanggal Diupdate"
                                                            },
                                                            {
                                                                value: "status",
                                                                label: "Status"
                                                            },
                                                            {
                                                                value: "company_type",
                                                                label: "Tipe Bisnis"
                                                            }
                                                        ].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    setSortField(option.value);
                                                                    setSortFieldDropdownOpen(false);
                                                                },
                                                                className: `w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${sortField === option.value ? "text-red-600 bg-red-50" : "text-gray-700"}`,
                                                                children: option.label
                                                            }, option.value, false, {
                                                                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                                                lineNumber: 1768,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                                        lineNumber: 1743,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                            lineNumber: 1736,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                    lineNumber: 1717,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                            lineNumber: 1689,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                    lineNumber: 1661,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                lineNumber: 1659,
                columnNumber: 7
            }, this),
            !loading && !error && filteredRegistrations.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSearch"], {
                            className: "w-8 h-8 text-gray-400"
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                            lineNumber: 1796,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1795,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-gray-800 mb-2",
                        children: "Tidak ada registrasi"
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1798,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500",
                        children: searchQuery || selectedStatus !== "all" ? "Coba ubah filter atau kata kunci pencarian" : "Belum ada pengajuan registrasi member"
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1801,
                        columnNumber: 11
                    }, this),
                    (searchQuery || selectedStatus !== "all") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setSearchQuery("");
                            setSelectedStatus("all");
                        },
                        className: "mt-4 px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all",
                        children: "Clear Filters"
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1807,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                lineNumber: 1794,
                columnNumber: 9
            }, this),
            !loading && !error && filteredRegistrations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                        children: filteredRegistrations.map((registration)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$registration$2f$RegistrationCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RegistrationCard"], {
                                registration: registration,
                                tourMode: approveTourActive && registration.id === tourRegistration.id,
                                onViewDetails: ()=>handleViewDetails(registration),
                                onSync: ()=>handleSync(registration),
                                isSyncing: Boolean(syncingIds[registration.id]),
                                syncLabel: getSyncLabel(registration),
                                syncReadOnly: isSyncReadOnly(registration)
                            }, registration.id, false, {
                                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                lineNumber: 1825,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1823,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3 pt-2 text-sm text-gray-500 md:flex-row md:items-center md:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Showing ",
                                    filteredRegistrations.length,
                                    " loaded registrations",
                                    debouncedSearchQuery ? " matching current search" : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                lineNumber: 1840,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: hasMore ? "Scroll ke bawah untuk memuat lebih banyak" : "Semua data yang tersedia sudah dimuat"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                                lineNumber: 1844,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1839,
                        columnNumber: 11
                    }, this),
                    hasMore ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: loadMoreRef,
                        className: "flex h-16 items-center justify-center text-sm text-gray-400",
                        children: loadingMore ? "Memuat data berikutnya..." : "Siap memuat data berikutnya..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                        lineNumber: 1851,
                        columnNumber: 13
                    }, this) : null
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$registration$2f$RegistrationDetailModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RegistrationDetailModal"], {
                isOpen: isDetailModalOpen,
                onClose: ()=>setIsDetailModalOpen(false),
                registration: selectedRegistration,
                demoMode: approveTourActive && selectedRegistration?.id === tourRegistration.id,
                onDemoRegistrationChange: handleDemoRegistrationChange,
                onApprove: handleApprove,
                onReject: handleReject,
                onSync: (registration)=>handleSync(registration),
                onRollback: (registration)=>handleRollback(registration),
                isSyncing: selectedRegistration ? Boolean(syncingIds[selectedRegistration.id]) : false,
                isRollbacking: selectedRegistration ? Boolean(rollbackingIds[selectedRegistration.id]) : false,
                syncLabel: selectedRegistration ? getSyncLabel(selectedRegistration) : "Sync",
                syncReadOnly: selectedRegistration ? isSyncReadOnly(selectedRegistration) : false,
                rollbackLabel: "Rollback",
                rollbackReadOnly: false
            }, void 0, false, {
                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                lineNumber: 1864,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$registration$2f$ApproveRegistrationModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApproveRegistrationModal"], {
                isOpen: isApproveModalOpen,
                onClose: ()=>{
                    setIsApproveModalOpen(false);
                    setSelectedForAction(null);
                },
                registration: selectedForAction,
                demoMode: approveTourActive && selectedForAction?.id === tourRegistration.id,
                onSuccess: handleApproveSuccess
            }, void 0, false, {
                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                lineNumber: 1897,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$registration$2f$RejectRegistrationModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RejectRegistrationModal"], {
                isOpen: isRejectModalOpen,
                onClose: ()=>{
                    setIsRejectModalOpen(false);
                    setSelectedForAction(null);
                },
                registration: selectedForAction,
                onSuccess: handleRejectSuccess
            }, void 0, false, {
                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                lineNumber: 1911,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ActionResultModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: Boolean(resultModal?.isOpen),
                type: resultModal?.type || "success",
                title: resultModal?.title || "Informasi",
                message: resultModal?.message || "",
                description: resultModal?.description,
                details: resultModal?.details,
                onClose: ()=>setResultModal(null)
            }, void 0, false, {
                fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
                lineNumber: 1921,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/customers/registration/CustomerRegistrationList.tsx",
        lineNumber: 1596,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_customers_registration_ba1e6f51._.js.map