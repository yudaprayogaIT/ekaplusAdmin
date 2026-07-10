(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/auth/RequireAuth.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PermissionButton",
    ()=>PermissionButton,
    "PermissionGate",
    ()=>PermissionGate,
    "default",
    ()=>RequireAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$loginPrompt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/loginPrompt.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
// src/components/auth/RequireAuth.tsx
"use client";
;
;
;
;
;
;
;
function RequireAuth({ children, permission, permissions, requireAll = false, fallbackUrl = "/", showAccessDenied = false }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isAuthenticated, isLoading, hasPermission, hasAnyPermission, hasAllPermissions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // Check if user has required permissions
    const checkPermissions = ()=>{
        // If no specific permission required, just need to be authenticated
        if (!permission && !permissions) return true;
        // Check single permission
        if (permission) {
            return hasPermission(permission);
        }
        // Check multiple permissions
        if (permissions && permissions.length > 0) {
            return requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
        }
        return true;
    };
    const hasRequiredPermissions = isAuthenticated && checkPermissions();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RequireAuth.useEffect": ()=>{
            if (!isLoading && !isAuthenticated) {
                router.replace(fallbackUrl);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$loginPrompt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatchOpenLoginModal"])();
            }
        }
    }["RequireAuth.useEffect"], [
        isLoading,
        isAuthenticated,
        router,
        fallbackUrl
    ]);
    // Loading state
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-[60vh]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/RequireAuth.tsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 font-medium",
                        children: "Memuat..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/RequireAuth.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/RequireAuth.tsx",
                lineNumber: 71,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/auth/RequireAuth.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, this);
    }
    if (!isAuthenticated) {
        return null;
    }
    // Authenticated but no permission - show access denied
    if (!hasRequiredPermissions) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            className: "flex items-center justify-center min-h-[60vh] p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaLock"], {
                            className: "w-10 h-10 text-amber-500"
                        }, void 0, false, {
                            fileName: "[project]/src/components/auth/RequireAuth.tsx",
                            lineNumber: 93,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/RequireAuth.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-gray-900 mb-2",
                        children: "Akses Ditolak"
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/RequireAuth.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 mb-6",
                        children: "Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi administrator jika Anda merasa ini adalah kesalahan."
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/RequireAuth.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-amber-50 rounded-xl mb-6 text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-amber-800",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Permission yang diperlukan:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/auth/RequireAuth.tsx",
                                    lineNumber: 107,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/RequireAuth.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 flex flex-wrap gap-1",
                                children: [
                                    permission && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        className: "px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs",
                                        children: permission
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth/RequireAuth.tsx",
                                        lineNumber: 111,
                                        columnNumber: 17
                                    }, this),
                                    permissions?.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                            className: "px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs",
                                            children: p
                                        }, p, false, {
                                            fileName: "[project]/src/components/auth/RequireAuth.tsx",
                                            lineNumber: 116,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/auth/RequireAuth.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/auth/RequireAuth.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                            whileHover: {
                                scale: 1.02
                            },
                            whileTap: {
                                scale: 0.98
                            },
                            className: "inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaHome"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/auth/RequireAuth.tsx",
                                    lineNumber: 132,
                                    columnNumber: 15
                                }, this),
                                "Kembali ke Dashboard"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/auth/RequireAuth.tsx",
                            lineNumber: 127,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/RequireAuth.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/RequireAuth.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/auth/RequireAuth.tsx",
            lineNumber: 86,
            columnNumber: 7
        }, this);
    }
    // All checks passed - render children
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(RequireAuth, "z8R/wYyi3HG8ymCHBHIwACcTWJ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = RequireAuth;
function PermissionButton({ permission, permissions, requireAll = false, children, fallback, hideIfNoPermission = true, disabled, className, ...props }) {
    _s1();
    const { isAuthenticated, hasPermission, hasAnyPermission, hasAllPermissions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const checkPermissions = ()=>{
        if (!isAuthenticated) return false;
        if (!permission && !permissions) return true;
        if (permission) return hasPermission(permission);
        if (permissions && permissions.length > 0) {
            return requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
        }
        return true;
    };
    const hasAccess = checkPermissions();
    if (!hasAccess) {
        if (hideIfNoPermission) return null;
        if (fallback) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: fallback
        }, void 0, false);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            ...props,
            disabled: true,
            className: `${className} opacity-50 cursor-not-allowed`,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/auth/RequireAuth.tsx",
            lineNumber: 193,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ...props,
        disabled: disabled,
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/auth/RequireAuth.tsx",
        lineNumber: 204,
        columnNumber: 5
    }, this);
}
_s1(PermissionButton, "JbG88rXtWbCZPWomHz0wSGHL3oo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c1 = PermissionButton;
function PermissionGate({ permission, permissions, requireAll = false, requireAuth = true, children, fallback = null }) {
    _s2();
    const { isAuthenticated, hasPermission, hasAnyPermission, hasAllPermissions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // Check auth requirement
    if (requireAuth && !isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: fallback
        }, void 0, false);
    }
    // If authenticated but no specific permission needed
    if (!permission && !permissions) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    // Check permissions
    let hasAccess = false;
    if (permission) {
        hasAccess = hasPermission(permission);
    } else if (permissions && permissions.length > 0) {
        hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
    }
    return hasAccess ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: fallback
    }, void 0, false);
}
_s2(PermissionGate, "JbG88rXtWbCZPWomHz0wSGHL3oo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c2 = PermissionGate;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "RequireAuth");
__turbopack_context__.k.register(_c1, "PermissionButton");
__turbopack_context__.k.register(_c2, "PermissionGate");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/fetchAllQueryRows.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAllQueryRows",
    ()=>fetchAllQueryRows
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-client] (ecmascript)");
"use client";
;
const DEFAULT_PAGE_SIZE = 20;
async function fetchAllQueryRows({ endpoint, spec, token, requestInit, errorMessage }) {
    const rows = [];
    let page = 1;
    while(true){
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(endpoint, {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/ActionResultModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ActionResultModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$hi2$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/hi2/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ActionResultModal({ isOpen, type = "success", title, message, description, details, confirmLabel = "OK", onClose }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ActionResultModal.useEffect": ()=>{
            if (!isOpen) return;
            const onKeyDown = {
                "ActionResultModal.useEffect.onKeyDown": (event)=>{
                    if (event.key === "Escape") onClose();
                }
            }["ActionResultModal.useEffect.onKeyDown"];
            window.addEventListener("keydown", onKeyDown);
            return ({
                "ActionResultModal.useEffect": ()=>window.removeEventListener("keydown", onKeyDown)
            })["ActionResultModal.useEffect"];
        }
    }["ActionResultModal.useEffect"], [
        isOpen,
        onClose
    ]);
    const isSuccess = type === "success";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4",
            onClick: (event)=>{
                if (event.target === event.currentTarget) onClose();
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    scale: 0.95,
                    y: 8
                },
                animate: {
                    opacity: 1,
                    scale: 1,
                    y: 0
                },
                exit: {
                    opacity: 0,
                    scale: 0.95,
                    y: 8
                },
                className: "w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `px-5 py-4 flex items-center justify-between ${isSuccess ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center",
                                        children: isSuccess ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCheckCircle"], {
                                            className: "w-5 h-5 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                            lineNumber: 72,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaExclamationTriangle"], {
                                            className: "w-5 h-5 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                            lineNumber: 74,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                        lineNumber: 70,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-base font-bold text-white",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                        lineNumber: 77,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                lineNumber: 69,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onClose,
                                className: "rounded-lg p-1.5 hover:bg-white/20 transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$hi2$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HiXMark"], {
                                    className: "w-5 h-5 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                    lineNumber: 84,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                lineNumber: 79,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                        lineNumber: 62,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-5 py-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-14 h-14 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center",
                                children: isSuccess ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCheckCircle"], {
                                    className: "w-7 h-7 text-green-600"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                    lineNumber: 91,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaExclamationTriangle"], {
                                    className: "w-7 h-7 text-red-600"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                    lineNumber: 93,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                lineNumber: 89,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-bold text-gray-900 text-center whitespace-pre-line",
                                children: message
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                lineNumber: 97,
                                columnNumber: 15
                            }, this),
                            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 text-center mt-2",
                                children: description
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                lineNumber: 102,
                                columnNumber: 17
                            }, this),
                            details && details.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-5 rounded-xl border border-gray-200 overflow-hidden",
                                children: details.map((detail, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `px-4 py-3 flex items-start justify-between gap-3 ${idx !== details.length - 1 ? "border-b border-gray-200" : ""}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 font-semibold uppercase tracking-wide",
                                                children: detail.label
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                                lineNumber: 118,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-900 font-semibold text-right whitespace-pre-line",
                                                children: detail.value
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                                lineNumber: 121,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, `${detail.label}-${idx}`, true, {
                                        fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                        lineNumber: 110,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                                lineNumber: 108,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                        lineNumber: 88,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-5 pb-5 flex justify-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            className: `px-5 py-2.5 rounded-xl font-medium text-white ${isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`,
                            children: confirmLabel
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                            lineNumber: 131,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                        lineNumber: 130,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/ActionResultModal.tsx",
                lineNumber: 56,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/ActionResultModal.tsx",
            lineNumber: 50,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/ActionResultModal.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_s(ActionResultModal, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ActionResultModal;
var _c;
__turbopack_context__.k.register(_c, "ActionResultModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/workflow-actions/WorkflowActionBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkflowActionBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function getActionTone(actionLabel) {
    const normalized = actionLabel.toLowerCase();
    if (normalized.includes("approve")) {
        return {
            wrapperClassName: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70",
            buttonClassName: "from-green-500 to-emerald-600 shadow-green-200 hover:shadow-green-300",
            badgeClassName: "bg-emerald-100 text-emerald-700",
            // helperText: "Lanjutkan approval untuk request ini.",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCheckCircle"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this)
        };
    }
    if (normalized.includes("reject")) {
        return {
            wrapperClassName: "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-rose-100/70",
            buttonClassName: "from-red-500 to-rose-600 shadow-red-200 hover:shadow-red-300",
            badgeClassName: "bg-rose-100 text-rose-700",
            // helperText: "Wajib isi alasan reject sebelum action dikirim.",
            // requiresNote: true,
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaReply"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                lineNumber: 43,
                columnNumber: 13
            }, this)
        };
    }
    return {
        wrapperClassName: "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-100/70",
        buttonClassName: "from-sky-500 to-cyan-600 shadow-sky-200 hover:shadow-sky-300",
        badgeClassName: "bg-sky-100 text-sky-700",
        helperText: "Jalankan action workflow untuk dokumen ini.",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaPaperPlane"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
            lineNumber: 54,
            columnNumber: 11
        }, this)
    };
}
function WorkflowActionBar({ actions, loadingActionId = null, disabled = false, onActionClick }) {
    if (actions.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: actions.map((workflowAction)=>{
            const tone = getActionTone(workflowAction.action);
            const isLoading = loadingActionId === workflowAction.id;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `rounded-2xl border p-4 shadow-sm transition ${tone.wrapperClassName}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 flex items-start justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-slate-900",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm",
                                            children: tone.icon
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                                            lineNumber: 80,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-base font-bold",
                                                    children: workflowAction.action
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-slate-500",
                                                    children: tone.helperText
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                                            lineNumber: 83,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                                    lineNumber: 79,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                                lineNumber: 78,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap justify-end gap-2",
                                children: workflowAction.mode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${tone.badgeClassName}`,
                                    children: workflowAction.mode
                                }, void 0, false, {
                                    fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                                    lineNumber: 93,
                                    columnNumber: 19
                                }, this) : null
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                                lineNumber: 91,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                        lineNumber: 77,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onActionClick(workflowAction),
                        disabled: disabled || isLoading,
                        className: `inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 ${tone.buttonClassName}`,
                        children: [
                            tone.icon,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: isLoading ? "Memproses..." : workflowAction.action
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                                lineNumber: 115,
                                columnNumber: 15
                            }, this),
                            !isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaArrowRight"], {
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                                lineNumber: 116,
                                columnNumber: 29
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                        lineNumber: 108,
                        columnNumber: 13
                    }, this)
                ]
            }, workflowAction.id, true, {
                fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
                lineNumber: 73,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/workflow-actions/WorkflowActionBar.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_c = WorkflowActionBar;
var _c;
__turbopack_context__.k.register(_c, "WorkflowActionBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkflowRejectNoteModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function WorkflowRejectNoteModal({ open, action, loading = false, onClose, onSubmit }) {
    _s();
    const [note, setNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkflowRejectNoteModal.useEffect": ()=>{
            if (!open) return;
            setNote("");
            setError(null);
        }
    }["WorkflowRejectNoteModal.useEffect"], [
        open,
        action?.id
    ]);
    if (!open || !action) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4",
            onClick: (event)=>{
                if (event.target === event.currentTarget && !loading) {
                    onClose();
                }
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 8,
                    scale: 0.97
                },
                animate: {
                    opacity: 1,
                    y: 0,
                    scale: 1
                },
                exit: {
                    opacity: 0,
                    y: 8,
                    scale: 0.97
                },
                className: "w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between bg-gradient-to-r from-red-500 to-rose-600 px-5 py-4 text-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-10 w-10 items-center justify-center rounded-xl bg-white/20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaReply"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                            lineNumber: 58,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                        lineNumber: 57,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-bold",
                                                children: action.action
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                                lineNumber: 61,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-red-50",
                                                children: "Alasan reject wajib diisi sebelum action dikirim."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                                lineNumber: 62,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onClose,
                                disabled: loading,
                                className: "rounded-lg p-2 transition hover:bg-white/20 disabled:opacity-60",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTimes"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                    lineNumber: 73,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        className: "space-y-4 p-5",
                        onSubmit: async (event)=>{
                            event.preventDefault();
                            const trimmed = note.trim();
                            if (!trimmed) {
                                setError("Rejected note wajib diisi.");
                                return;
                            }
                            setError(null);
                            await onSubmit(trimmed);
                        },
                        children: [
                            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-2 block text-sm font-semibold text-gray-700",
                                        children: "Rejected Note"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                        lineNumber: 99,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: note,
                                        onChange: (event)=>setNote(event.target.value),
                                        rows: 5,
                                        required: true,
                                        disabled: loading,
                                        placeholder: "Tuliskan alasan reject...",
                                        className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-300 focus:bg-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 flex items-center justify-between text-xs text-slate-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Berikan alasan yang jelas agar mudah ditindaklanjuti."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                                lineNumber: 112,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    note.trim().length,
                                                    " karakter"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                                lineNumber: 115,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-3 border-t border-gray-100 pt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: onClose,
                                        disabled: loading,
                                        className: "rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50",
                                        children: "Batal"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                        lineNumber: 120,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: loading,
                                        className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSave"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                                lineNumber: 133,
                                                columnNumber: 17
                                            }, this),
                                            loading ? "Memproses..." : action.action
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                                lineNumber: 119,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_s(WorkflowRejectNoteModal, "BgSbDaqQ8ECp0fowcdSm+7jXZsQ=");
_c = WorkflowRejectNoteModal;
var _c;
__turbopack_context__.k.register(_c, "WorkflowRejectNoteModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/workflowActionService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "executeWorkflowAction",
    ()=>executeWorkflowAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-client] (ecmascript)");
"use client";
;
async function executeWorkflowAction({ token, resourceName, documentId, actionId, payload }) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.WORKFLOW_EXECUTE}/${resourceName}/${documentId}/${actionId}`), {
        method: "POST",
        headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthHeaders"])(token),
        body: JSON.stringify(payload ?? {}),
        cache: "no-store"
    }, token);
    const responseBody = await response.json().catch(async ()=>({
            message: await response.text().catch(()=>"")
        }));
    if (!response.ok) {
        const message = typeof responseBody === "object" && responseBody && "message" in responseBody && typeof responseBody.message === "string" ? responseBody.message : `Failed to execute workflow action (${response.status})`;
        throw new Error(message);
    }
    return responseBody;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/customers/credit-change-request/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildBranchCustomerLabel",
    ()=>buildBranchCustomerLabel,
    "buildDirectorWhatsappText",
    ()=>buildDirectorWhatsappText,
    "formatRequestDate",
    ()=>formatRequestDate,
    "policyTypeLabel",
    ()=>policyTypeLabel,
    "resolvePolicyDisplayName",
    ()=>resolvePolicyDisplayName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-client] (ecmascript)");
"use client";
;
function buildBranchCustomerLabel(row, gcMap, branchMap) {
    const gcObject = row.gcid && typeof row.gcid === "object" ? row.gcid : null;
    const branchObject = row.branch && typeof row.branch === "object" ? row.branch : null;
    const gcId = gcObject ? Number(gcObject.id || 0) : Number(row.gcid || 0);
    const branchId = branchObject ? Number(branchObject.id || 0) : Number(row.branch || 0);
    const gcName = gcObject?.gc_name || gcObject?.name || gcMap.get(gcId) || "";
    const branchName = branchObject?.city || branchObject?.branch_name || branchMap.get(branchId) || "";
    const combined = [
        gcName,
        branchName
    ].filter(Boolean).join(" - ");
    return combined || row.name || `Branch Customer ${row.id}`;
}
function policyTypeLabel(value) {
    const normalized = String(value || "").trim().toLowerCase();
    if (normalized === "nbid") return "National Brand";
    if (normalized === "gpid") return "Group Parent";
    if (normalized === "gcid") return "Group Customer";
    if (normalized === "bcid") return "Branch Customer";
    return normalized || "-";
}
function formatRequestDate(value) {
    const rawValue = value || new Date().toISOString();
    const date = new Date(rawValue);
    if (Number.isNaN(date.getTime())) {
        return rawValue;
    }
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}
function buildDirectorWhatsappText(params) {
    const { policyName, requestDate, creditLimitText, paymentTermText } = params;
    return [
        "Selamat siang Bapak/Ibu,",
        "",
        "Dengan hormat,",
        `Nama Group: ${policyName}`,
        `Tanggal Pengajuan: ${requestDate}`,
        `Request Credit Limit: ${creditLimitText}`,
        `Request Payment Term: ${paymentTermText}`,
        "",
        "Bersama ini kami menyampaikan pengajuan perubahan fasilitas kredit customer sebagaimana rincian tersebut di atas.",
        'Apabila Bapak/Ibu berkenan menyetujui pengajuan tersebut, mohon konfirmasi dengan membalas "Setuju" pada pesan ini.',
        "",
        "Atas perhatian dan konfirmasinya, kami ucapkan terima kasih."
    ].join("\n");
}
async function resolvePolicyDisplayName(params) {
    const { token, policyType, policyId } = params;
    const normalizedType = String(policyType || "").trim().toLowerCase();
    const numericPolicyId = Number(policyId || 0);
    if (!token || !numericPolicyId) {
        return "-";
    }
    switch(normalizedType){
        case "nbid":
            {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.NATIONAL_BRAND}/${numericPolicyId}`, {
                    fields: [
                        "id",
                        "nb_name"
                    ]
                }), {
                    method: "GET",
                    cache: "no-store"
                }, token);
                if (!response.ok) {
                    throw new Error(`Gagal memuat national brand (${response.status})`);
                }
                const json = await response.json();
                const row = json?.data || null;
                return row?.nb_name || row?.name || `National Brand ${numericPolicyId}`;
            }
        case "gpid":
            {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_PARENT}/${numericPolicyId}`, {
                    fields: [
                        "id",
                        "gp_name"
                    ]
                }), {
                    method: "GET",
                    cache: "no-store"
                }, token);
                if (!response.ok) {
                    throw new Error(`Gagal memuat group parent (${response.status})`);
                }
                const json = await response.json();
                const row = json?.data || null;
                return row?.gp_name || row?.name || `Group Parent ${numericPolicyId}`;
            }
        case "gcid":
            {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_CUSTOMER}/${numericPolicyId}`, {
                    fields: [
                        "id",
                        "gc_name"
                    ]
                }), {
                    method: "GET",
                    cache: "no-store"
                }, token);
                if (!response.ok) {
                    throw new Error(`Gagal memuat group customer (${response.status})`);
                }
                const json = await response.json();
                const row = json?.data || null;
                return row?.gc_name || row?.name || `Group Customer ${numericPolicyId}`;
            }
        case "bcid":
            {
                const [bcResponse, gcResponse, branchResponse] = await Promise.all([
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2}/${numericPolicyId}`, {
                        fields: [
                            "id",
                            "name",
                            "gcid",
                            "branch"
                        ]
                    }), {
                        method: "GET",
                        cache: "no-store"
                    }, token),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_CUSTOMER, {
                        fields: [
                            "id",
                            "name",
                            "gc_name"
                        ],
                        page: 1
                    }), {
                        method: "GET",
                        cache: "no-store"
                    }, token),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH, {
                        fields: [
                            "id",
                            "branch_name",
                            "city"
                        ],
                        page: 1
                    }), {
                        method: "GET",
                        cache: "no-store"
                    }, token)
                ]);
                if (!bcResponse.ok) {
                    throw new Error(`Gagal memuat branch customer (${bcResponse.status})`);
                }
                if (!gcResponse.ok) {
                    throw new Error(`Gagal memuat group customer (${gcResponse.status})`);
                }
                if (!branchResponse.ok) {
                    throw new Error(`Gagal memuat branch (${branchResponse.status})`);
                }
                const [bcJson, gcJson, branchJson] = await Promise.all([
                    bcResponse.json(),
                    gcResponse.json(),
                    branchResponse.json()
                ]);
                const row = bcJson?.data || null;
                const groupCustomers = Array.isArray(gcJson?.data) ? gcJson.data : [];
                const branches = Array.isArray(branchJson?.data) ? branchJson.data : [];
                const gcMap = new Map(groupCustomers.map((item)=>[
                        item.id,
                        item.gc_name || item.name || `Group Customer ${item.id}`
                    ]));
                const branchMap = new Map(branches.map((item)=>[
                        item.id,
                        item.city || item.branch_name || `Branch ${item.id}`
                    ]));
                return row ? buildBranchCustomerLabel(row, gcMap, branchMap) : `Branch Customer ${numericPolicyId}`;
            }
        default:
            return "-";
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreditChangeRequestDetailModal",
    ()=>CreditChangeRequestDetailModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ActionResultModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ActionResultModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workflow$2d$actions$2f$WorkflowActionBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/workflow-actions/WorkflowActionBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workflow$2d$actions$2f$WorkflowRejectNoteModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/workflow-actions/WorkflowRejectNoteModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$workflowActionService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/workflowActionService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/customers/credit-change-request/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
function resolveUserName(explicitName, value) {
    if (explicitName) return explicitName;
    if (value && typeof value === "object" && value.full_name) return value.full_name;
    if (typeof value === "number") return `User ${value}`;
    return "System";
}
function formatCurrency(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return "-";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 2
    }).format(value);
}
function formatDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short"
    });
}
function displayText(value) {
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
}
function formatDays(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return "-";
    return `${value} hari`;
}
function getStatusBadgeTone(status) {
    const normalized = (status || "").toLowerCase();
    if (normalized.includes("approve")) {
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
    if (normalized.includes("reject")) {
        return "bg-rose-100 text-rose-700 border-rose-200";
    }
    if (normalized.includes("draft")) {
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
    if (normalized.includes("marketing") || normalized.includes("request")) {
        return "bg-sky-100 text-sky-700 border-sky-200";
    }
    return "bg-white/15 text-white border-white/20";
}
async function copyToClipboard(value) {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
    }
    if (typeof document === "undefined") {
        throw new Error("Clipboard tidak tersedia");
    }
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        const success = document.execCommand("copy");
        if (!success) {
            throw new Error("Gagal menyalin teks WA");
        }
    } finally{
        document.body.removeChild(textarea);
    }
}
function getPreviewType(params) {
    const { url, contentType } = params;
    if (contentType) {
        const normalizedType = contentType.toLowerCase();
        if (normalizedType.startsWith("image/")) return "image";
        if (normalizedType.includes("pdf")) return "pdf";
        return "file";
    }
    if (!url) return "none";
    const normalized = url.toLowerCase();
    if (normalized.endsWith(".png") || normalized.endsWith(".jpg") || normalized.endsWith(".jpeg") || normalized.endsWith(".webp") || normalized.endsWith(".gif")) {
        return "image";
    }
    if (normalized.endsWith(".pdf")) {
        return "pdf";
    }
    return "file";
}
function AttachmentPreview({ label, url, token }) {
    _s();
    const [blobUrl, setBlobUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [contentType, setContentType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [imagePreviewOpen, setImagePreviewOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [imageZoomed, setImageZoomed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [imageZoomOrigin, setImageZoomOrigin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 50,
        y: 50
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AttachmentPreview.useEffect": ()=>{
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
                    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])(url, {
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
                        setError(loadError instanceof Error ? loadError.message : "Gagal memuat preview lampiran");
                    }
                } finally{
                    if (!cancelled) {
                        setLoading(false);
                    }
                }
            }
            void loadPreview();
            return ({
                "AttachmentPreview.useEffect": ()=>{
                    cancelled = true;
                    if (objectUrl) URL.revokeObjectURL(objectUrl);
                }
            })["AttachmentPreview.useEffect"];
        }
    }["AttachmentPreview.useEffect"], [
        token,
        url
    ]);
    const previewType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AttachmentPreview.useMemo[previewType]": ()=>getPreviewType({
                url,
                contentType
            })
    }["AttachmentPreview.useMemo[previewType]"], [
        contentType,
        url
    ]);
    const previewUrl = blobUrl || url || "";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                lineNumber: 346,
                columnNumber: 7
            }, this),
            !url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-sm text-slate-700",
                children: "-"
            }, void 0, false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                lineNumber: 350,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 space-y-3",
                children: [
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500",
                        children: "Memuat preview lampiran..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                        lineNumber: 354,
                        columnNumber: 13
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                        lineNumber: 359,
                        columnNumber: 13
                    }, this),
                    !loading && !error && previewType === "image" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setImagePreviewOpen(true);
                                    setImageZoomed(false);
                                    setImageZoomOrigin({
                                        x: 50,
                                        y: 50
                                    });
                                },
                                className: "block w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left transition hover:border-sky-300",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative h-72 w-full bg-white",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: previewUrl,
                                        alt: label,
                                        fill: true,
                                        unoptimized: true,
                                        className: "object-contain"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                        lineNumber: 375,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                    lineNumber: 374,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                lineNumber: 365,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-slate-500",
                                children: "Klik gambar untuk melihat preview lebih besar."
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                lineNumber: 384,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    !loading && !error && previewType === "pdf" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-hidden rounded-xl border border-slate-200 bg-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                            src: previewUrl,
                            title: label,
                            className: "h-72 w-full"
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                            lineNumber: 391,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                        lineNumber: 390,
                        columnNumber: 13
                    }, this),
                    !loading && !error && previewType === "file" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600",
                        children: "Preview tidak tersedia untuk tipe file ini."
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                        lineNumber: 395,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                lineNumber: 352,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: imagePreviewOpen && previewType === "image" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    className: "fixed inset-0 z-[70] flex items-center justify-center bg-slate-100/90 p-4 backdrop-blur-sm",
                    onClick: (event)=>event.target === event.currentTarget ? setImagePreviewOpen(false) : undefined,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            scale: 0.96
                        },
                        animate: {
                            opacity: 1,
                            scale: 1
                        },
                        exit: {
                            opacity: 0,
                            scale: 0.96
                        },
                        className: "relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setImagePreviewOpen(false);
                                    setImageZoomed(false);
                                    setImageZoomOrigin({
                                        x: 50,
                                        y: 50
                                    });
                                },
                                className: "absolute right-4 top-4 z-10 rounded-xl bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTimes"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                    lineNumber: 430,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                lineNumber: 421,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `relative h-[80vh] w-full overflow-hidden bg-slate-100 ${imageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`,
                                onDoubleClick: (event)=>{
                                    const rect = event.currentTarget.getBoundingClientRect();
                                    const x = (event.clientX - rect.left) / rect.width * 100;
                                    const y = (event.clientY - rect.top) / rect.height * 100;
                                    setImageZoomOrigin({
                                        x,
                                        y
                                    });
                                    setImageZoomed((prev)=>!prev);
                                },
                                onMouseMove: (event)=>{
                                    if (!imageZoomed) return;
                                    const rect = event.currentTarget.getBoundingClientRect();
                                    const x = (event.clientX - rect.left) / rect.width * 100;
                                    const y = (event.clientY - rect.top) / rect.height * 100;
                                    setImageZoomOrigin({
                                        x: Math.min(100, Math.max(0, x)),
                                        y: Math.min(100, Math.max(0, y))
                                    });
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: previewUrl,
                                        alt: label,
                                        fill: true,
                                        unoptimized: true,
                                        className: `object-contain transition-transform duration-200 ${imageZoomed ? "scale-[1.8]" : "scale-100"}`,
                                        style: {
                                            transformOrigin: `${imageZoomOrigin.x}% ${imageZoomOrigin.y}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                        lineNumber: 457,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm",
                                        children: imageZoomed ? "Arahkan mouse ke area yang ingin dilihat, double click untuk reset zoom." : "Double click untuk zoom."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                        lineNumber: 469,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                lineNumber: 432,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                        lineNumber: 415,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                    lineNumber: 404,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                lineNumber: 402,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
        lineNumber: 345,
        columnNumber: 5
    }, this);
}
_s(AttachmentPreview, "mIDmK9VUpF01/g1HcF/+iN15ZHM=");
_c = AttachmentPreview;
function CreditChangeRequestDetailModal({ isOpen, onClose, item, onActionExecuted }) {
    _s1();
    const { token, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [detail, setDetail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [actions, setActions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [executingActionId, setExecutingActionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pendingRejectAction, setPendingRejectAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [policyName, setPolicyName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("-");
    const [policyNameLoading, setPolicyNameLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [policyNameError, setPolicyNameError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [affectedBranches, setAffectedBranches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [affectedBranchesLoading, setAffectedBranchesLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [affectedBranchesError, setAffectedBranchesError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [customerApprovalFile, setCustomerApprovalFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploadingApprovalAttachment, setUploadingApprovalAttachment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [waPreviewOpen, setWaPreviewOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [resultModal, setResultModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isOpen: false,
        type: "success",
        title: "",
        message: ""
    });
    const loadDetail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CreditChangeRequestDetailModal.useCallback[loadDetail]": async ()=>{
            if (!isOpen || !item || !token || !isAuthenticated) return;
            setLoading(true);
            setError(null);
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CREDIT_CHANGE_REQUEST}/${item.id}`, {
                    fields: [
                        "*",
                        "created_by.full_name",
                        "updated_by.full_name"
                    ]
                }), {
                    method: "GET",
                    cache: "no-store"
                }, token);
                if (!response.ok) {
                    throw new Error(`Failed to fetch credit change request detail (${response.status})`);
                }
                const json = await response.json();
                setDetail(json.data || null);
                setActions(Array.isArray(json.action) ? json.action : []);
            } catch (loadError) {
                setDetail(null);
                setActions([]);
                setError(loadError instanceof Error ? loadError.message : "Gagal memuat detail credit change request");
            } finally{
                setLoading(false);
            }
        }
    }["CreditChangeRequestDetailModal.useCallback[loadDetail]"], [
        isAuthenticated,
        isOpen,
        item,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestDetailModal.useEffect": ()=>{
            void loadDetail();
        }
    }["CreditChangeRequestDetailModal.useEffect"], [
        loadDetail
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestDetailModal.useEffect": ()=>{
            if (!isOpen) return;
            setCustomerApprovalFile(null);
            setWaPreviewOpen(false);
        }
    }["CreditChangeRequestDetailModal.useEffect"], [
        isOpen,
        item?.id
    ]);
    const activeDetail = detail || null;
    const normalizedActions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreditChangeRequestDetailModal.useMemo[normalizedActions]": ()=>actions
    }["CreditChangeRequestDetailModal.useMemo[normalizedActions]"], [
        actions
    ]);
    const attachmentUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFileUrl"])(activeDetail?.identity_attachment);
    const customerApprovalAttachmentUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFileUrl"])(activeDetail?.customer_approval_attachment ?? item?.customerApprovalAttachment);
    const createdBy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreditChangeRequestDetailModal.useMemo[createdBy]": ()=>resolveUserName(activeDetail?.["created_by.full_name"], activeDetail?.created_by)
    }["CreditChangeRequestDetailModal.useMemo[createdBy]"], [
        activeDetail
    ]);
    const updatedBy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreditChangeRequestDetailModal.useMemo[updatedBy]": ()=>resolveUserName(activeDetail?.["updated_by.full_name"], activeDetail?.updated_by)
    }["CreditChangeRequestDetailModal.useMemo[updatedBy]"], [
        activeDetail
    ]);
    const currentStatus = activeDetail?.status || item?.status || "";
    const isInDirector = currentStatus === "In Director";
    const effectivePolicyType = activeDetail?.policy_type ?? item?.policyType;
    const effectivePolicyId = activeDetail?.policy_id ?? item?.policyId;
    const effectiveRequestedCreditLimit = activeDetail?.requested_credit_limit ?? item?.requestedCreditLimit ?? activeDetail?.current_credit_limit ?? item?.currentCreditLimit ?? null;
    const effectiveRequestedPaymentTerm = activeDetail?.requested_payment_term ?? item?.requestedPaymentTerm ?? activeDetail?.current_payment_term ?? item?.currentPaymentTerm ?? null;
    const waPreviewText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreditChangeRequestDetailModal.useMemo[waPreviewText]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildDirectorWhatsappText"])({
                policyName,
                requestDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRequestDate"])(activeDetail?.created_at ?? item?.createdAt),
                creditLimitText: formatCurrency(effectiveRequestedCreditLimit),
                paymentTermText: formatDays(effectiveRequestedPaymentTerm)
            })
    }["CreditChangeRequestDetailModal.useMemo[waPreviewText]"], [
        activeDetail?.created_at,
        effectiveRequestedCreditLimit,
        effectiveRequestedPaymentTerm,
        item?.createdAt,
        policyName
    ]);
    const hasStoredCustomerApprovalAttachment = Boolean(activeDetail?.customer_approval_attachment ?? item?.customerApprovalAttachment);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestDetailModal.useEffect": ()=>{
            let cancelled = false;
            async function loadPolicyName() {
                if (!isOpen || !token) return;
                setPolicyNameLoading(true);
                setPolicyNameError(null);
                try {
                    const resolvedPolicyName = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolvePolicyDisplayName"])({
                        token,
                        policyType: effectivePolicyType,
                        policyId: effectivePolicyId
                    });
                    if (!cancelled) {
                        setPolicyName(resolvedPolicyName);
                    }
                } catch (loadError) {
                    if (!cancelled) {
                        setPolicyName("-");
                        setPolicyNameError(loadError instanceof Error ? loadError.message : "Gagal memuat nama policy");
                    }
                } finally{
                    if (!cancelled) {
                        setPolicyNameLoading(false);
                    }
                }
            }
            void loadPolicyName();
            return ({
                "CreditChangeRequestDetailModal.useEffect": ()=>{
                    cancelled = true;
                }
            })["CreditChangeRequestDetailModal.useEffect"];
        }
    }["CreditChangeRequestDetailModal.useEffect"], [
        effectivePolicyId,
        effectivePolicyType,
        isOpen,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestDetailModal.useEffect": ()=>{
            let cancelled = false;
            async function loadAffectedBranches() {
                if (!isOpen || !token || !effectivePolicyType || !effectivePolicyId) {
                    setAffectedBranches([]);
                    setAffectedBranchesError(null);
                    setAffectedBranchesLoading(false);
                    return;
                }
                setAffectedBranchesLoading(true);
                setAffectedBranchesError(null);
                try {
                    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_policy_hierarchy`), {
                        method: "POST",
                        cache: "no-store",
                        body: JSON.stringify({
                            level: effectivePolicyType,
                            value: effectivePolicyId,
                            format: "full",
                            entities: [
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
                                        "gc_name"
                                    ]
                                },
                                gps: {
                                    fields: [
                                        "id",
                                        "gp_name"
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
                    if (!response.ok) {
                        throw new Error(`Gagal memuat daftar customer cabang (${response.status})`);
                    }
                    const json = await response.json();
                    const rows = json.data?.data?.bcs;
                    if (!cancelled) {
                        setAffectedBranches(Array.isArray(rows) ? rows : []);
                    }
                } catch (loadError) {
                    if (!cancelled) {
                        setAffectedBranches([]);
                        setAffectedBranchesError(loadError instanceof Error ? loadError.message : "Gagal memuat daftar customer cabang");
                    }
                } finally{
                    if (!cancelled) {
                        setAffectedBranchesLoading(false);
                    }
                }
            }
            void loadAffectedBranches();
            return ({
                "CreditChangeRequestDetailModal.useEffect": ()=>{
                    cancelled = true;
                }
            })["CreditChangeRequestDetailModal.useEffect"];
        }
    }["CreditChangeRequestDetailModal.useEffect"], [
        effectivePolicyId,
        effectivePolicyType,
        isOpen,
        token
    ]);
    const uploadCustomerApprovalAttachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CreditChangeRequestDetailModal.useCallback[uploadCustomerApprovalAttachment]": async ()=>{
            if (!token || !item?.id || !customerApprovalFile) {
                return;
            }
            setUploadingApprovalAttachment(true);
            try {
                const formData = new FormData();
                formData.append("customer_approval_attachment", customerApprovalFile);
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getResourceUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CREDIT_CHANGE_REQUEST, item.id), {
                    method: "PUT",
                    headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthHeadersFormData"])(token),
                    body: formData,
                    cache: "no-store"
                }, token);
                if (!response.ok) {
                    const json = await response.json().catch({
                        "CreditChangeRequestDetailModal.useCallback[uploadCustomerApprovalAttachment]": ()=>({})
                    }["CreditChangeRequestDetailModal.useCallback[uploadCustomerApprovalAttachment]"]);
                    throw new Error(json?.message || `Gagal mengunggah attachment approval customer (${response.status})`);
                }
                setCustomerApprovalFile(null);
                await loadDetail();
                await onActionExecuted?.();
            } finally{
                setUploadingApprovalAttachment(false);
            }
        }
    }["CreditChangeRequestDetailModal.useCallback[uploadCustomerApprovalAttachment]"], [
        customerApprovalFile,
        item?.id,
        loadDetail,
        onActionExecuted,
        token
    ]);
    const executeAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CreditChangeRequestDetailModal.useCallback[executeAction]": async (workflowAction, payload)=>{
            if (!token || !item) {
                setResultModal({
                    isOpen: true,
                    type: "error",
                    title: "Action Gagal",
                    message: "Token atau dokumen tidak tersedia."
                });
                return;
            }
            const normalizedLabel = workflowAction.action.toLowerCase();
            const isRejectAction = normalizedLabel.includes("reject");
            const requiresDirectorAttachment = isInDirector && !isRejectAction;
            const hasAnyCustomerApprovalAttachment = hasStoredCustomerApprovalAttachment || Boolean(customerApprovalFile);
            if (requiresDirectorAttachment && !hasAnyCustomerApprovalAttachment) {
                const message = "Screenshot persetujuan customer wajib diunggah dulu sebelum melanjutkan action dari In Director.";
                setError(message);
                setResultModal({
                    isOpen: true,
                    type: "error",
                    title: "Attachment Wajib",
                    message
                });
                return;
            }
            setExecutingActionId(workflowAction.id);
            setError(null);
            try {
                if (requiresDirectorAttachment && customerApprovalFile) {
                    await uploadCustomerApprovalAttachment();
                }
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$workflowActionService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["executeWorkflowAction"])({
                    token,
                    resourceName: "credit_change_request",
                    documentId: item.id,
                    actionId: workflowAction.id,
                    payload
                });
                await loadDetail();
                await onActionExecuted?.();
                setPendingRejectAction(null);
                setResultModal({
                    isOpen: true,
                    type: "success",
                    title: "Action Berhasil",
                    message: `${workflowAction.action} berhasil dijalankan`,
                    description: "Status dokumen dan daftar credit change request sudah diperbarui."
                });
            } catch (actionError) {
                const message = actionError instanceof Error ? actionError.message : "Gagal menjalankan action workflow";
                setError(message);
                setResultModal({
                    isOpen: true,
                    type: "error",
                    title: "Action Gagal",
                    message
                });
                throw actionError;
            } finally{
                setExecutingActionId(null);
            }
        }
    }["CreditChangeRequestDetailModal.useCallback[executeAction]"], [
        customerApprovalFile,
        hasStoredCustomerApprovalAttachment,
        isInDirector,
        item,
        loadDetail,
        onActionExecuted,
        token,
        uploadCustomerApprovalAttachment
    ]);
    const handleActionClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CreditChangeRequestDetailModal.useCallback[handleActionClick]": async (workflowAction)=>{
            const normalizedLabel = workflowAction.action.toLowerCase();
            if (normalizedLabel.includes("reject")) {
                setPendingRejectAction(workflowAction);
                return;
            }
            await executeAction(workflowAction);
        }
    }["CreditChangeRequestDetailModal.useCallback[handleActionClick]"], [
        executeAction
    ]);
    if (!isOpen || !item) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: [
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
                onClick: (event)=>event.target === event.currentTarget ? onClose() : undefined,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.96,
                        y: 12
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.96,
                        y: 12
                    },
                    className: "flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-4 bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 text-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100",
                                            children: "Credit Change Request"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 925,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "mt-1 text-2xl font-bold",
                                            children: policyNameLoading ? item.code : policyName
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 928,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-emerald-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: item.policyTypeLabel
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 932,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "hidden text-emerald-200 sm:inline",
                                                    children: "•"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 933,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Policy ID:",
                                                        " ",
                                                        displayText(activeDetail?.policy_id ?? item.policyId)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 934,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 931,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                    lineNumber: 924,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeTone(currentStatus)}`,
                                            children: displayText(currentStatus)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 941,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: onClose,
                                            className: "rounded-xl bg-white/15 p-2 transition hover:bg-white/25",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTimes"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                lineNumber: 953,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 948,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                    lineNumber: 940,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                            lineNumber: 923,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto bg-slate-50 px-6 py-6",
                            children: [
                                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500",
                                    children: "Memuat detail credit change request..."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                    lineNumber: 960,
                                    columnNumber: 17
                                }, this),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                    lineNumber: 966,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-2xl border border-slate-200 bg-white p-5 grid grid-cols-2 gap-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaMoneyBillWave"], {
                                                                    className: "text-emerald-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 975,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-bold text-slate-900",
                                                                    children: "Current Values"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 976,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 974,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl bg-slate-50 p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Current Credit Limit"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 982,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-lg font-bold text-emerald-700",
                                                                    children: formatCurrency(activeDetail?.current_credit_limit ?? item.currentCreditLimit)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 985,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 981,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl bg-slate-50 p-4 mt-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Current Payment Term"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 993,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-sm font-semibold text-slate-900",
                                                                    children: formatDays(activeDetail?.current_payment_term ?? item.currentPaymentTerm)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 996,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 992,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 973,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaExchangeAlt"], {
                                                                    className: "text-blue-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1018,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-bold text-slate-900",
                                                                    children: "Requested Values"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1019,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1017,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl bg-slate-50 p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Requested Credit Limit"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1025,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-lg font-bold text-blue-700",
                                                                    children: formatCurrency(activeDetail?.requested_credit_limit ?? item.requestedCreditLimit)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1028,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1024,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl bg-slate-50 p-4 mt-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Requested Payment Term"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1036,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-sm font-semibold text-slate-900",
                                                                    children: formatDays(activeDetail?.requested_payment_term ?? item.requestedPaymentTerm)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1039,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1035,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1016,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 972,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-2xl border border-slate-200 bg-white p-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUser"], {
                                                            className: "text-indigo-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1106,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-bold text-slate-900",
                                                                    children: "Daftar Customer Yang Akan Mengikuti Credit Limit Ini"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1108,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-slate-500",
                                                                    children: affectedBranchesLoading ? "Memuat data cabang..." : `${affectedBranches.length} customer dalam cakupan policy ini`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1111,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1107,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1105,
                                                    columnNumber: 19
                                                }, this),
                                                affectedBranchesError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700",
                                                    children: affectedBranchesError
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1120,
                                                    columnNumber: 21
                                                }, this),
                                                !affectedBranchesError && affectedBranchesLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500",
                                                    children: "Memuat daftar customer yang akan mengikuti credit limit ini..."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1126,
                                                    columnNumber: 21
                                                }, this),
                                                !affectedBranchesError && !affectedBranchesLoading && (affectedBranches.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 gap-3 md:grid-cols-2",
                                                    children: affectedBranches.map((branch)=>{
                                                        const gcName = branch._relations?.gcid?.gc_name?.trim() || "-";
                                                        const city = branch._relations?.branch?.city?.trim() || "-";
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl border border-slate-200 bg-slate-50 p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-bold text-slate-900",
                                                                    children: [
                                                                        gcName,
                                                                        " - ",
                                                                        city
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1147,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-sm font-semibold text-indigo-700",
                                                                    children: displayText(branch.name)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1150,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, branch.id, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1143,
                                                            columnNumber: 29
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1135,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500",
                                                    children: "Tidak ada customer cabang dalam cakupan policy ini."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1158,
                                                    columnNumber: 23
                                                }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 1104,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-2xl border border-slate-200 bg-white p-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaStickyNote"], {
                                                            className: "text-amber-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1166,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-lg font-bold text-slate-900",
                                                            children: "Notes"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1167,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1165,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 gap-4 md:grid-cols-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Reason"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1171,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800",
                                                                    children: displayText(activeDetail?.reason ?? item.reason)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1174,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1170,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Rejected Note"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1179,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800",
                                                                    children: displayText(activeDetail?.rejected_note ?? item.rejectedNote)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1182,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1178,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1169,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 1164,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 gap-6 xl:grid-cols-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                    className: "rounded-2xl border border-slate-200 bg-white p-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileAlt"], {
                                                                    className: "text-sky-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1194,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-bold text-slate-900",
                                                                    children: "Identity Attachment"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1195,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1193,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AttachmentPreview, {
                                                            label: "Identity Attachment",
                                                            url: attachmentUrl,
                                                            token: token
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1199,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1192,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                    className: "rounded-2xl border border-slate-200 bg-white p-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaImage"], {
                                                                    className: "text-sky-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1208,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-bold text-slate-900",
                                                                    children: "Customer Approval Attachment"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1209,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1207,
                                                            columnNumber: 21
                                                        }, this),
                                                        isInDirector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "mb-1 block text-sm font-semibold text-slate-700",
                                                                            children: "Upload Screenshot Persetujuan Customer"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1216,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 transition hover:border-emerald-300 hover:bg-white",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUpload"], {
                                                                                    className: "h-4 w-4 text-emerald-600"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                                    lineNumber: 1220,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "flex-1",
                                                                                    children: customerApprovalFile ? customerApprovalFile.name : "Pilih file approval customer"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                                    lineNumber: 1221,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700",
                                                                                    children: "Upload"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                                    lineNumber: 1226,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "file",
                                                                                    accept: "image/*,.pdf",
                                                                                    disabled: uploadingApprovalAttachment || executingActionId !== null,
                                                                                    className: "hidden",
                                                                                    onChange: (event)=>{
                                                                                        const file = event.target.files?.[0] || null;
                                                                                        setCustomerApprovalFile(file);
                                                                                        setError(null);
                                                                                    }
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                                    lineNumber: 1229,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1219,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-1 text-xs text-slate-500",
                                                                            children: "Saat workflow berada di `In Director`, lampiran ini wajib ada sebelum action lanjut."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1244,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1215,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-wrap gap-3",
                                                                    children: [
                                                                        customerApprovalFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>{
                                                                                setCustomerApprovalFile(null);
                                                                            },
                                                                            disabled: uploadingApprovalAttachment || executingActionId !== null,
                                                                            className: "rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70",
                                                                            children: "Reset File"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1251,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>{
                                                                                setWaPreviewOpen(true);
                                                                            },
                                                                            disabled: policyNameLoading,
                                                                            className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaPaperPlane"], {
                                                                                    className: "h-4 w-4"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                                    lineNumber: 1273,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                policyNameLoading ? "Memuat..." : "Preview Teks WA"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1265,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1249,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1214,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AttachmentPreview, {
                                                            label: "Customer Approval Attachment",
                                                            url: customerApprovalAttachmentUrl,
                                                            token: token
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1281,
                                                            columnNumber: 21
                                                        }, this),
                                                        policyNameError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700",
                                                            children: policyNameError
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1287,
                                                            columnNumber: 23
                                                        }, this) : null
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1206,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 1191,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-2xl border border-slate-200 bg-white p-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaClock"], {
                                                            className: "text-sky-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1296,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-lg font-bold text-slate-900",
                                                            children: "Sync Information"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1297,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1295,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 gap-4 md:grid-cols-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Saga Status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1303,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 rounded-xl bg-slate-50 p-3 text-sm text-slate-800",
                                                                    children: displayText(activeDetail?.saga_status)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1306,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1302,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Sync Saga ID"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1311,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 rounded-xl bg-slate-50 p-3 text-sm text-slate-800",
                                                                    children: displayText(activeDetail?.sync_saga_id)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1314,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1310,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Sync Last Error"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1319,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800",
                                                                    children: displayText(activeDetail?.sync_last_error)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1322,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1318,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Sync Last Rollback Error"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1327,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800",
                                                                    children: displayText(activeDetail?.sync_last_rollback_error)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1330,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1326,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1301,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 1294,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-2xl border border-slate-200 bg-white p-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUser"], {
                                                            className: "text-violet-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1339,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-lg font-bold text-slate-900",
                                                            children: "Audit Trail"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1340,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1338,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 gap-4 md:grid-cols-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl bg-slate-50 p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUser"], {
                                                                            className: "h-3 w-3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1347,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        "Created By"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1346,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-2 text-sm font-semibold text-slate-900",
                                                                    children: createdBy || item.createdBy
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1350,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-3 flex items-center gap-2 text-xs text-slate-500",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCalendarAlt"], {
                                                                            className: "h-3 w-3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1354,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: formatDateTime(activeDetail?.created_at ?? item.createdAt)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1355,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1353,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1345,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl bg-slate-50 p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUser"], {
                                                                            className: "h-3 w-3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1364,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        "Updated By"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1363,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-2 text-sm font-semibold text-slate-900",
                                                                    children: updatedBy || item.updatedBy
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1367,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-3 flex items-center gap-2 text-xs text-slate-500",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCalendarAlt"], {
                                                                            className: "h-3 w-3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1371,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: formatDateTime(activeDetail?.updated_at ?? item.updatedAt)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1372,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1370,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1362,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1344,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 1337,
                                            columnNumber: 17
                                        }, this),
                                        normalizedActions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-2xl border border-slate-200 bg-white p-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4 flex items-start justify-between gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCheckCircle"], {
                                                                    className: "text-emerald-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1386,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "text-lg font-bold text-slate-900",
                                                                            children: "Available Actions"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1388,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-1 text-sm text-slate-500",
                                                                            children: "Pilih action workflow yang sesuai untuk dokumen ini."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                            lineNumber: 1391,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                                    lineNumber: 1387,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1385,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600",
                                                            children: [
                                                                normalizedActions.length,
                                                                " action tersedia"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                            lineNumber: 1396,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1384,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workflow$2d$actions$2f$WorkflowActionBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    actions: normalizedActions,
                                                    loadingActionId: executingActionId,
                                                    disabled: loading,
                                                    onActionClick: (workflowAction)=>{
                                                        void handleActionClick(workflowAction);
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                    lineNumber: 1400,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 1383,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                    lineNumber: 971,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                            lineNumber: 958,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                    lineNumber: 917,
                    columnNumber: 11
                }, this)
            }, "credit-change-request-detail", false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                lineNumber: 910,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workflow$2d$actions$2f$WorkflowRejectNoteModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: pendingRejectAction !== null,
                action: pendingRejectAction,
                loading: pendingRejectAction !== null && executingActionId === pendingRejectAction.id,
                onClose: ()=>{
                    if (executingActionId) return;
                    setPendingRejectAction(null);
                },
                onSubmit: async (note)=>{
                    if (!pendingRejectAction) return;
                    await executeAction(pendingRejectAction, {
                        rejected_note: note
                    });
                }
            }, "credit-change-request-reject-note", false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                lineNumber: 1416,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ActionResultModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: resultModal.isOpen,
                type: resultModal.type,
                title: resultModal.title,
                message: resultModal.message,
                description: resultModal.description,
                onClose: ()=>setResultModal((current)=>({
                            ...current,
                            isOpen: false
                        }))
            }, "credit-change-request-action-result", false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                lineNumber: 1434,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: waPreviewOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            scale: 0.96,
                            y: 12
                        },
                        animate: {
                            opacity: 1,
                            scale: 1,
                            y: 0
                        },
                        exit: {
                            opacity: 0,
                            scale: 0.96,
                            y: 12
                        },
                        className: "w-full max-w-2xl rounded-2xl bg-white shadow-2xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between border-b border-slate-200 px-6 py-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-bold text-slate-900",
                                                children: "Preview Teks WhatsApp"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                lineNumber: 1460,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm text-slate-500",
                                                children: "Ringkasan pengajuan untuk konfirmasi customer."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                lineNumber: 1463,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                        lineNumber: 1459,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setWaPreviewOpen(false),
                                        className: "rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTimes"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                            lineNumber: 1472,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                        lineNumber: 1467,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                lineNumber: 1458,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4 px-6 py-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        readOnly: true,
                                        value: waPreviewText,
                                        rows: 14,
                                        className: "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                        lineNumber: 1476,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-end gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setWaPreviewOpen(false),
                                                className: "rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50",
                                                children: "Tutup"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                lineNumber: 1483,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: async ()=>{
                                                    try {
                                                        await copyToClipboard(waPreviewText);
                                                        setResultModal({
                                                            isOpen: true,
                                                            type: "success",
                                                            title: "Teks Berhasil Disalin",
                                                            message: "Teks WhatsApp berhasil disalin ke clipboard."
                                                        });
                                                    } catch (copyError) {
                                                        setResultModal({
                                                            isOpen: true,
                                                            type: "error",
                                                            title: "Copy Gagal",
                                                            message: copyError instanceof Error ? copyError.message : "Gagal menyalin teks WhatsApp"
                                                        });
                                                    }
                                                },
                                                className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCopy"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                        lineNumber: 1516,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Copy"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                                lineNumber: 1490,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                        lineNumber: 1482,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                                lineNumber: 1475,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                        lineNumber: 1452,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                    lineNumber: 1451,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
                lineNumber: 1449,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx",
        lineNumber: 908,
        columnNumber: 5
    }, this);
}
_s1(CreditChangeRequestDetailModal, "qm5lSP4h6AqrW7R/QdxPB+kOxYg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c1 = CreditChangeRequestDetailModal;
var _c, _c1;
__turbopack_context__.k.register(_c, "AttachmentPreview");
__turbopack_context__.k.register(_c1, "CreditChangeRequestDetailModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreditChangeRequestFormModal",
    ()=>CreditChangeRequestFormModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/customers/credit-change-request/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const POLICY_TYPE_OPTIONS = [
    {
        value: "nbid",
        label: "National Brand"
    },
    {
        value: "gpid",
        label: "Group Parent"
    }
];
const LOOKUP_PAGE_SIZE = 20;
const EMPTY_LOOKUP_META = {
    nbid: {
        page: 0,
        hasMore: true,
        loaded: false,
        search: ""
    },
    gpid: {
        page: 0,
        hasMore: true,
        loaded: false,
        search: ""
    },
    gcid: {
        page: 0,
        hasMore: true,
        loaded: false,
        search: ""
    },
    bcid: {
        page: 0,
        hasMore: true,
        loaded: false,
        search: ""
    }
};
async function loadLookupPage(token, policyType, page, search) {
    const searchValue = search.trim();
    switch(policyType){
        case "nbid":
            {
                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.NATIONAL_BRAND, {
                    fields: [
                        "id",
                        "name",
                        "nb_name"
                    ],
                    page,
                    ...searchValue ? {
                        search: searchValue
                    } : {}
                }), {
                    method: "GET",
                    cache: "no-store"
                }, token);
                if (!res.ok) {
                    throw new Error(`Failed to fetch national brand (${res.status})`);
                }
                const json = await res.json();
                const rows = Array.isArray(json?.data) ? json.data : [];
                return {
                    items: rows.map((row)=>({
                            id: row.id,
                            label: row.nb_name || row.name || `National Brand ${row.id}`
                        })),
                    hasMore: rows.length >= LOOKUP_PAGE_SIZE
                };
            }
        case "gpid":
            {
                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_PARENT, {
                    fields: [
                        "id",
                        "name",
                        "gp_name"
                    ],
                    page,
                    ...searchValue ? {
                        search: searchValue
                    } : {}
                }), {
                    method: "GET",
                    cache: "no-store"
                }, token);
                if (!res.ok) {
                    throw new Error(`Failed to fetch group parent (${res.status})`);
                }
                const json = await res.json();
                const rows = Array.isArray(json?.data) ? json.data : [];
                return {
                    items: rows.map((row)=>({
                            id: row.id,
                            label: row.gp_name || row.name || `Group Parent ${row.id}`
                        })),
                    hasMore: rows.length >= LOOKUP_PAGE_SIZE
                };
            }
        case "gcid":
            {
                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_CUSTOMER, {
                    fields: [
                        "id",
                        "name",
                        "gc_name"
                    ],
                    page,
                    ...searchValue ? {
                        search: searchValue
                    } : {}
                }), {
                    method: "GET",
                    cache: "no-store"
                }, token);
                if (!res.ok) {
                    throw new Error(`Failed to fetch group customer (${res.status})`);
                }
                const json = await res.json();
                const rows = Array.isArray(json?.data) ? json.data : [];
                return {
                    items: rows.map((row)=>({
                            id: row.id,
                            label: row.gc_name || row.name || `Group Customer ${row.id}`
                        })),
                    hasMore: rows.length >= LOOKUP_PAGE_SIZE
                };
            }
        case "bcid":
            {
                const [bcRes, gcRes, branchRes] = await Promise.all([
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2, {
                        fields: [
                            "id",
                            "name",
                            "gcid",
                            "branch"
                        ],
                        page,
                        ...searchValue ? {
                            search: searchValue
                        } : {}
                    }), {
                        method: "GET",
                        cache: "no-store"
                    }, token),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_CUSTOMER, {
                        fields: [
                            "id",
                            "name",
                            "gc_name"
                        ],
                        page: 1
                    }), {
                        method: "GET",
                        cache: "no-store"
                    }, token),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH, {
                        fields: [
                            "id",
                            "branch_name",
                            "city"
                        ],
                        page: 1
                    }), {
                        method: "GET",
                        cache: "no-store"
                    }, token)
                ]);
                if (!bcRes.ok) {
                    throw new Error(`Failed to fetch branch customer (${bcRes.status})`);
                }
                if (!gcRes.ok) {
                    throw new Error(`Failed to fetch group customer (${gcRes.status})`);
                }
                if (!branchRes.ok) {
                    throw new Error(`Failed to fetch branch (${branchRes.status})`);
                }
                const [bcJson, gcJson, branchJson] = await Promise.all([
                    bcRes.json(),
                    gcRes.json(),
                    branchRes.json()
                ]);
                const branchCustomers = Array.isArray(bcJson?.data) ? bcJson.data : [];
                const groupCustomers = Array.isArray(gcJson?.data) ? gcJson.data : [];
                const branches = Array.isArray(branchJson?.data) ? branchJson.data : [];
                const gcMap = new Map(groupCustomers.map((row)=>[
                        row.id,
                        row.gc_name || row.name || `Group Customer ${row.id}`
                    ]));
                const branchMap = new Map(branches.map((row)=>[
                        row.id,
                        row.city || row.branch_name || `Branch ${row.id}`
                    ]));
                return {
                    items: branchCustomers.map((row)=>({
                            id: row.id,
                            label: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildBranchCustomerLabel"])(row, gcMap, branchMap)
                        })),
                    hasMore: branchCustomers.length >= LOOKUP_PAGE_SIZE
                };
            }
        default:
            return {
                items: [],
                hasMore: false
            };
    }
}
function formatIntegerWithThousands(value) {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function normalizeCurrencyInput(value) {
    const sanitized = value.replace(/[^0-9.,]/g, "");
    if (!sanitized) return "";
    if (!sanitized.includes(",")) {
        return formatIntegerWithThousands(sanitized.replace(/\./g, ""));
    }
    const withoutDots = sanitized.replace(/\./g, "");
    const [rawIntegerPart = "", ...rawDecimalParts] = withoutDots.split(",");
    const formattedIntegerPart = formatIntegerWithThousands(rawIntegerPart);
    const decimalPart = rawDecimalParts.join("").replace(/\D/g, "");
    if (sanitized.endsWith(",") && !decimalPart) {
        return `${formattedIntegerPart},`;
    }
    return decimalPart ? `${formattedIntegerPart},${decimalPart}` : formattedIntegerPart;
}
function parseCurrencyInput(value) {
    const sanitized = value.replace(/[^0-9.,]/g, "").trim();
    if (!sanitized) return undefined;
    const hasComma = sanitized.includes(",");
    const hasDot = sanitized.includes(".");
    let normalized = sanitized;
    if (hasComma && hasDot) {
        const lastComma = sanitized.lastIndexOf(",");
        const lastDot = sanitized.lastIndexOf(".");
        normalized = lastComma > lastDot ? sanitized.replace(/\./g, "").replace(/,/g, ".") : sanitized.replace(/,/g, "");
    } else if (hasComma) {
        normalized = sanitized.replace(/\./g, "").replace(/,/g, ".");
    } else if ((sanitized.match(/\./g) || []).length > 1) {
        normalized = sanitized.replace(/\./g, "");
    }
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
}
function parseIntegerInput(value) {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    return Number.isInteger(parsed) ? parsed : Number.NaN;
}
function formatCurrency(value) {
    if (value === null || value === undefined || Number.isNaN(value)) return "-";
    return new Intl.NumberFormat("id-ID").format(value);
}
function formatDays(value) {
    if (value === null || value === undefined || Number.isNaN(value)) return "-";
    return `${new Intl.NumberFormat("id-ID").format(value)} hari`;
}
function resolveUserName(value) {
    if (!value) return "-";
    if (typeof value === "string") return value;
    if (typeof value === "number") return `User #${value}`;
    if (typeof value === "object") {
        const candidate = value;
        return candidate.full_name || candidate.name || candidate.email || (candidate.id ? `User #${candidate.id}` : "-");
    }
    return "-";
}
async function copyToClipboard(value) {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
    }
    if (typeof document === "undefined") {
        throw new Error("Clipboard tidak tersedia");
    }
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        const success = document.execCommand("copy");
        if (!success) {
            throw new Error("Gagal menyalin teks WA");
        }
    } finally{
        document.body.removeChild(textarea);
    }
}
function endpointForPolicyType(policyType) {
    switch(policyType){
        case "nbid":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.NATIONAL_BRAND;
        case "gpid":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_PARENT;
        case "gcid":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_CUSTOMER;
        case "bcid":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2;
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.NATIONAL_BRAND;
    }
}
function CreditChangeRequestFormModal({ open, onClose, onSave, saving = false }) {
    _s();
    const { token, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const policyDropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [policyType, setPolicyType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("nbid");
    const [policyId, setPolicyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [policySearch, setPolicySearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [debouncedPolicySearch, setDebouncedPolicySearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [policyDropdownOpen, setPolicyDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [requestedCreditLimit, setRequestedCreditLimit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [requestedPaymentTerm, setRequestedPaymentTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [requestedLimitCustomerOverdue, setRequestedLimitCustomerOverdue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [applyToChilds, setApplyToChilds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [reason, setReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [identityAttachment, setIdentityAttachment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [customerApprovalAttachment, setCustomerApprovalAttachment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lookups, setLookups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        nbid: [],
        gpid: [],
        gcid: [],
        bcid: []
    });
    const [lookupMeta, setLookupMeta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(EMPTY_LOOKUP_META);
    const [lookupLoading, setLookupLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentProfile, setCurrentProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentProfileLoading, setCurrentProfileLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [affectedBranches, setAffectedBranches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [affectedBranchesLoading, setAffectedBranchesLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [affectedBranchesError, setAffectedBranchesError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [waPreviewOpen, setWaPreviewOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestFormModal.useEffect": ()=>{
            if (!open) return;
            setPolicyType("nbid");
            setPolicyId("");
            setPolicySearch("");
            setDebouncedPolicySearch("");
            setPolicyDropdownOpen(false);
            setRequestedCreditLimit("");
            setRequestedPaymentTerm("");
            setRequestedLimitCustomerOverdue("");
            setApplyToChilds(true);
            setReason("");
            setIdentityAttachment(null);
            setCustomerApprovalAttachment(null);
            setError(null);
            setCurrentProfile(null);
            setCurrentProfileLoading(false);
            setAffectedBranches([]);
            setAffectedBranchesLoading(false);
            setAffectedBranchesError(null);
            setWaPreviewOpen(false);
            setLookups({
                nbid: [],
                gpid: [],
                gcid: [],
                bcid: []
            });
            setLookupMeta(EMPTY_LOOKUP_META);
        }
    }["CreditChangeRequestFormModal.useEffect"], [
        open
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestFormModal.useEffect": ()=>{
            if (!open) return;
            const timer = window.setTimeout({
                "CreditChangeRequestFormModal.useEffect.timer": ()=>{
                    setDebouncedPolicySearch(policySearch.trim());
                }
            }["CreditChangeRequestFormModal.useEffect.timer"], 300);
            return ({
                "CreditChangeRequestFormModal.useEffect": ()=>window.clearTimeout(timer)
            })["CreditChangeRequestFormModal.useEffect"];
        }
    }["CreditChangeRequestFormModal.useEffect"], [
        open,
        policySearch
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestFormModal.useEffect": ()=>{
            if (!policyDropdownOpen) return;
            const handlePointerDown = {
                "CreditChangeRequestFormModal.useEffect.handlePointerDown": (event)=>{
                    if (policyDropdownRef.current && !policyDropdownRef.current.contains(event.target)) {
                        setPolicyDropdownOpen(false);
                    }
                }
            }["CreditChangeRequestFormModal.useEffect.handlePointerDown"];
            window.addEventListener("mousedown", handlePointerDown);
            return ({
                "CreditChangeRequestFormModal.useEffect": ()=>window.removeEventListener("mousedown", handlePointerDown)
            })["CreditChangeRequestFormModal.useEffect"];
        }
    }["CreditChangeRequestFormModal.useEffect"], [
        policyDropdownOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestFormModal.useEffect": ()=>{
            let cancelled = false;
            async function fetchLookupPage(page) {
                if (!open || !token || !isAuthenticated) return;
                setLookupLoading(true);
                try {
                    const result = await loadLookupPage(token, policyType, page, debouncedPolicySearch);
                    if (!cancelled) {
                        setLookups({
                            "CreditChangeRequestFormModal.useEffect.fetchLookupPage": (current)=>({
                                    ...current,
                                    [policyType]: page === 1 ? result.items : [
                                        ...current[policyType],
                                        ...result.items.filter({
                                            "CreditChangeRequestFormModal.useEffect.fetchLookupPage": (item)=>!current[policyType].some({
                                                    "CreditChangeRequestFormModal.useEffect.fetchLookupPage": (existing)=>existing.id === item.id
                                                }["CreditChangeRequestFormModal.useEffect.fetchLookupPage"])
                                        }["CreditChangeRequestFormModal.useEffect.fetchLookupPage"])
                                    ]
                                })
                        }["CreditChangeRequestFormModal.useEffect.fetchLookupPage"]);
                        setLookupMeta({
                            "CreditChangeRequestFormModal.useEffect.fetchLookupPage": (current)=>({
                                    ...current,
                                    [policyType]: {
                                        page,
                                        hasMore: result.hasMore,
                                        loaded: true,
                                        search: debouncedPolicySearch
                                    }
                                })
                        }["CreditChangeRequestFormModal.useEffect.fetchLookupPage"]);
                    }
                } catch (loadError) {
                    if (!cancelled) {
                        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data policy");
                    }
                } finally{
                    if (!cancelled) {
                        setLookupLoading(false);
                    }
                }
            }
            if (!lookupMeta[policyType].loaded || lookupMeta[policyType].search !== debouncedPolicySearch) {
                void fetchLookupPage(1);
            }
            return ({
                "CreditChangeRequestFormModal.useEffect": ()=>{
                    cancelled = true;
                }
            })["CreditChangeRequestFormModal.useEffect"];
        }
    }["CreditChangeRequestFormModal.useEffect"], [
        debouncedPolicySearch,
        isAuthenticated,
        lookupMeta,
        open,
        policyType,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestFormModal.useEffect": ()=>{
            if (!open) return;
            setPolicyId("");
            setPolicySearch("");
            setDebouncedPolicySearch("");
            setPolicyDropdownOpen(false);
            setCurrentProfile(null);
            setCurrentProfileLoading(false);
            setAffectedBranches([]);
            setAffectedBranchesLoading(false);
            setAffectedBranchesError(null);
        }
    }["CreditChangeRequestFormModal.useEffect"], [
        open,
        policyType
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestFormModal.useEffect": ()=>{
            let cancelled = false;
            async function fetchCurrentProfile() {
                const parsedPolicyId = Number(policyId || 0);
                if (!open || !token || !isAuthenticated || !parsedPolicyId) {
                    setCurrentProfile(null);
                    setCurrentProfileLoading(false);
                    return;
                }
                setCurrentProfileLoading(true);
                try {
                    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getResourceUrl"])(endpointForPolicyType(policyType), parsedPolicyId), {
                        method: "GET",
                        cache: "no-store"
                    }, token);
                    if (!response.ok) {
                        throw new Error(`Gagal memuat profil policy (${response.status})`);
                    }
                    const json = await response.json();
                    const data = json?.data;
                    if (!cancelled) {
                        setCurrentProfile({
                            creditLimit: typeof data?.credit_limit === "number" ? data.credit_limit : null,
                            paymentTerm: typeof data?.payment_term === "number" ? data.payment_term : null,
                            limitCustomerOverdue: typeof data?.limit_customer_overdue === "number" ? data.limit_customer_overdue : null,
                            createdBy: resolveUserName(data?.created_by)
                        });
                    }
                } catch (fetchError) {
                    if (!cancelled) {
                        setCurrentProfile(null);
                        setError(fetchError instanceof Error ? fetchError.message : "Gagal memuat profil policy saat ini");
                    }
                } finally{
                    if (!cancelled) {
                        setCurrentProfileLoading(false);
                    }
                }
            }
            void fetchCurrentProfile();
            return ({
                "CreditChangeRequestFormModal.useEffect": ()=>{
                    cancelled = true;
                }
            })["CreditChangeRequestFormModal.useEffect"];
        }
    }["CreditChangeRequestFormModal.useEffect"], [
        isAuthenticated,
        open,
        policyId,
        policyType,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestFormModal.useEffect": ()=>{
            let cancelled = false;
            async function fetchAffectedBranches() {
                const parsedPolicyId = Number(policyId || 0);
                if (!open || !token || !isAuthenticated || !parsedPolicyId) {
                    setAffectedBranches([]);
                    setAffectedBranchesLoading(false);
                    setAffectedBranchesError(null);
                    return;
                }
                setAffectedBranchesLoading(true);
                setAffectedBranchesError(null);
                try {
                    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_policy_hierarchy`), {
                        method: "POST",
                        cache: "no-store",
                        body: JSON.stringify({
                            level: policyType,
                            value: parsedPolicyId,
                            format: "full",
                            entities: [
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
                                        "gc_name"
                                    ]
                                },
                                gps: {
                                    fields: [
                                        "id",
                                        "gp_name"
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
                    if (!response.ok) {
                        throw new Error(`Gagal memuat daftar customer cabang (${response.status})`);
                    }
                    const json = await response.json();
                    const rows = json.data?.data?.bcs;
                    if (!cancelled) {
                        setAffectedBranches(Array.isArray(rows) ? rows : []);
                    }
                } catch (fetchError) {
                    if (!cancelled) {
                        setAffectedBranches([]);
                        setAffectedBranchesError(fetchError instanceof Error ? fetchError.message : "Gagal memuat daftar customer cabang");
                    }
                } finally{
                    if (!cancelled) {
                        setAffectedBranchesLoading(false);
                    }
                }
            }
            void fetchAffectedBranches();
            return ({
                "CreditChangeRequestFormModal.useEffect": ()=>{
                    cancelled = true;
                }
            })["CreditChangeRequestFormModal.useEffect"];
        }
    }["CreditChangeRequestFormModal.useEffect"], [
        isAuthenticated,
        open,
        policyId,
        policyType,
        token
    ]);
    const policyOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreditChangeRequestFormModal.useMemo[policyOptions]": ()=>lookups[policyType] || []
    }["CreditChangeRequestFormModal.useMemo[policyOptions]"], [
        lookups,
        policyType
    ]);
    const activeLookupMeta = lookupMeta[policyType];
    const selectedPolicyOption = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreditChangeRequestFormModal.useMemo[selectedPolicyOption]": ()=>policyOptions.find({
                "CreditChangeRequestFormModal.useMemo[selectedPolicyOption]": (option)=>String(option.id) === policyId
            }["CreditChangeRequestFormModal.useMemo[selectedPolicyOption]"]) || null
    }["CreditChangeRequestFormModal.useMemo[selectedPolicyOption]"], [
        policyId,
        policyOptions
    ]);
    const selectedPolicyLabel = selectedPolicyOption?.label || policySearch.trim() || "-";
    const effectiveRequestedCreditLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreditChangeRequestFormModal.useMemo[effectiveRequestedCreditLimit]": ()=>{
            const parsedValue = parseCurrencyInput(requestedCreditLimit);
            if (parsedValue !== undefined && Number.isFinite(parsedValue)) {
                return parsedValue;
            }
            return currentProfile?.creditLimit ?? null;
        }
    }["CreditChangeRequestFormModal.useMemo[effectiveRequestedCreditLimit]"], [
        currentProfile?.creditLimit,
        requestedCreditLimit
    ]);
    const effectiveRequestedPaymentTerm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreditChangeRequestFormModal.useMemo[effectiveRequestedPaymentTerm]": ()=>{
            const parsedValue = parseIntegerInput(requestedPaymentTerm);
            if (parsedValue !== undefined && Number.isInteger(parsedValue)) {
                return parsedValue;
            }
            return currentProfile?.paymentTerm ?? null;
        }
    }["CreditChangeRequestFormModal.useMemo[effectiveRequestedPaymentTerm]"], [
        currentProfile?.paymentTerm,
        requestedPaymentTerm
    ]);
    const waText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreditChangeRequestFormModal.useMemo[waText]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildDirectorWhatsappText"])({
                policyName: selectedPolicyLabel,
                requestDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRequestDate"])(),
                creditLimitText: effectiveRequestedCreditLimit === null ? "-" : `Rp ${formatCurrency(effectiveRequestedCreditLimit)}`,
                paymentTermText: effectiveRequestedPaymentTerm === null ? "-" : formatDays(effectiveRequestedPaymentTerm)
            })
    }["CreditChangeRequestFormModal.useMemo[waText]"], [
        effectiveRequestedCreditLimit,
        effectiveRequestedPaymentTerm,
        selectedPolicyLabel
    ]);
    const handleLoadMore = async ()=>{
        if (!token || !isAuthenticated || lookupLoading || !activeLookupMeta.hasMore) {
            return;
        }
        setError(null);
        setLookupLoading(true);
        try {
            const nextPage = activeLookupMeta.page + 1;
            const result = await loadLookupPage(token, policyType, nextPage, activeLookupMeta.search);
            setLookups((current)=>({
                    ...current,
                    [policyType]: [
                        ...current[policyType],
                        ...result.items.filter((item)=>!current[policyType].some((existing)=>existing.id === item.id))
                    ]
                }));
            setLookupMeta((current)=>({
                    ...current,
                    [policyType]: {
                        page: nextPage,
                        hasMore: result.hasMore,
                        loaded: true,
                        search: activeLookupMeta.search
                    }
                }));
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Gagal memuat data policy tambahan");
        } finally{
            setLookupLoading(false);
        }
    };
    const submit = async (event)=>{
        event.preventDefault();
        setError(null);
        const parsedPolicyId = Number(policyId || 0);
        const parsedCreditLimit = parseCurrencyInput(requestedCreditLimit);
        const parsedPaymentTerm = parseIntegerInput(requestedPaymentTerm);
        const parsedLimitCustomerOverdue = parseIntegerInput(requestedLimitCustomerOverdue);
        const trimmedReason = reason.trim();
        const resolvedRequestedCreditLimit = parsedCreditLimit !== undefined ? parsedCreditLimit : currentProfile?.creditLimit ?? undefined;
        const resolvedRequestedPaymentTerm = parsedPaymentTerm !== undefined ? parsedPaymentTerm : currentProfile?.paymentTerm ?? undefined;
        const resolvedRequestedLimitCustomerOverdue = parsedLimitCustomerOverdue !== undefined ? parsedLimitCustomerOverdue : currentProfile?.limitCustomerOverdue ?? undefined;
        if (!parsedPolicyId) {
            setError("Policy wajib dipilih.");
            return;
        }
        if (!trimmedReason) {
            setError("Reason wajib diisi.");
            return;
        }
        if (parsedCreditLimit === undefined && parsedPaymentTerm === undefined && parsedLimitCustomerOverdue === undefined) {
            setError("Minimal isi salah satu nilai perubahan yang diajukan.");
            return;
        }
        if (parsedCreditLimit !== undefined) {
            if (!Number.isFinite(parsedCreditLimit) || parsedCreditLimit < 0) {
                setError("Requested credit limit harus berupa angka valid 0 atau lebih.");
                return;
            }
        }
        if (parsedPaymentTerm !== undefined) {
            if (!Number.isInteger(parsedPaymentTerm) || parsedPaymentTerm < 0) {
                setError("Requested payment term harus berupa angka bulat 0 atau lebih.");
                return;
            }
        }
        if (parsedLimitCustomerOverdue !== undefined) {
            if (!Number.isInteger(parsedLimitCustomerOverdue) || parsedLimitCustomerOverdue < 0) {
                setError("Requested limit customer overdue harus berupa angka bulat 0 atau lebih.");
                return;
            }
        }
        try {
            await onSave({
                policyType,
                policyId: parsedPolicyId,
                applyToChilds,
                requestedCreditLimit: resolvedRequestedCreditLimit,
                requestedPaymentTerm: resolvedRequestedPaymentTerm,
                requestedLimitCustomerOverdue: resolvedRequestedLimitCustomerOverdue,
                reason: trimmedReason,
                identityAttachment,
                customerApprovalAttachment
            });
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan credit change request");
        }
    };
    const handlePolicySearchChange = (value)=>{
        setPolicySearch(value);
        setPolicyId("");
        setPolicyDropdownOpen(true);
    };
    const handlePolicySelect = (option)=>{
        setPolicyId(String(option.id));
        setPolicySearch(option.label);
        setPolicyDropdownOpen(false);
        setError(null);
    };
    const handlePolicyOptionsScroll = async (event)=>{
        const element = event.currentTarget;
        const remaining = element.scrollHeight - element.scrollTop - element.clientHeight;
        if (remaining < 24) {
            await handleLoadMore();
        }
    };
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.96
                    },
                    animate: {
                        opacity: 1,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.96
                    },
                    className: "flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileInvoiceDollar"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                lineNumber: 995,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                            lineNumber: 994,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-xl font-bold text-gray-800",
                                                    children: "Tambah Credit Change Request"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                    lineNumber: 998,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-500",
                                                    children: "Ajukan perubahan credit limit, payment term, atau overdue limit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                    lineNumber: 1001,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                            lineNumber: 997,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                    lineNumber: 993,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    disabled: saving,
                                    className: "rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTimes"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                        lineNumber: 1013,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                    lineNumber: 1007,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                            lineNumber: 992,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: submit,
                            className: "flex min-h-0 flex-1 flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-h-0 flex-1 overflow-y-auto p-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-5",
                                        children: [
                                            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaExclamationTriangle"], {
                                                        className: "mt-0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                        lineNumber: 1022,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: error
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                        lineNumber: 1023,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                lineNumber: 1021,
                                                columnNumber: 19
                                            }, this) : null,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: " gap-4 grid md:grid-cols-10",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "md:col-span-5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "mb-1 block text-sm font-semibold text-gray-700",
                                                                children: "Policy Type"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1029,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: policyType,
                                                                onChange: (e)=>setPolicyType(e.target.value),
                                                                disabled: saving,
                                                                className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300 focus:bg-white",
                                                                children: POLICY_TYPE_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: option.value,
                                                                        children: option.label
                                                                    }, option.value, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1041,
                                                                        columnNumber: 25
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1032,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                        lineNumber: 1028,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "md:col-span-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "mb-1 block text-sm font-semibold text-gray-700",
                                                                children: "Policy ID"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1049,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative",
                                                                ref: policyDropdownRef,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSearch"], {
                                                                        className: "pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1053,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: policySearch,
                                                                        onChange: (e)=>handlePolicySearchChange(e.target.value),
                                                                        onFocus: ()=>setPolicyDropdownOpen(true),
                                                                        disabled: saving,
                                                                        placeholder: "Cari policy...",
                                                                        className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-11 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300 focus:bg-white"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1054,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    policyDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                        initial: {
                                                                            opacity: 0,
                                                                            y: -6,
                                                                            scale: 0.98
                                                                        },
                                                                        animate: {
                                                                            opacity: 1,
                                                                            y: 0,
                                                                            scale: 1
                                                                        },
                                                                        exit: {
                                                                            opacity: 0,
                                                                            y: -4,
                                                                            scale: 0.98
                                                                        },
                                                                        transition: {
                                                                            duration: 0.18,
                                                                            ease: "easeOut"
                                                                        },
                                                                        className: "absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                            layout: true,
                                                                            className: "max-h-64 overflow-y-auto py-2",
                                                                            onScroll: handlePolicyOptionsScroll,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                                                                    mode: "popLayout",
                                                                                    initial: false,
                                                                                    children: policyOptions.length > 0 ? policyOptions.map((option)=>{
                                                                                        const isSelected = String(option.id) === policyId;
                                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                                                                            layout: true,
                                                                                            initial: {
                                                                                                opacity: 0,
                                                                                                y: 6
                                                                                            },
                                                                                            animate: {
                                                                                                opacity: 1,
                                                                                                y: 0
                                                                                            },
                                                                                            exit: {
                                                                                                opacity: 0,
                                                                                                y: -4
                                                                                            },
                                                                                            transition: {
                                                                                                duration: 0.15,
                                                                                                ease: "easeOut"
                                                                                            },
                                                                                            type: "button",
                                                                                            onClick: ()=>handlePolicySelect(option),
                                                                                            className: `flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm transition ${isSelected ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-50"}`,
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "line-clamp-2",
                                                                                                    children: option.label
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                                    lineNumber: 1104,
                                                                                                    columnNumber: 39
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "shrink-0 text-xs text-gray-400",
                                                                                                    children: [
                                                                                                        "#",
                                                                                                        option.id
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                                    lineNumber: 1107,
                                                                                                    columnNumber: 39
                                                                                                }, this)
                                                                                            ]
                                                                                        }, option.id, true, {
                                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                            lineNumber: 1086,
                                                                                            columnNumber: 37
                                                                                        }, this);
                                                                                    }) : lookupLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                                        initial: {
                                                                                            opacity: 0
                                                                                        },
                                                                                        animate: {
                                                                                            opacity: 1
                                                                                        },
                                                                                        exit: {
                                                                                            opacity: 0
                                                                                        },
                                                                                        className: "px-4 py-4 text-sm text-gray-500",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "flex items-center gap-3",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "h-2 w-2 animate-pulse rounded-full bg-emerald-500"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                                    lineNumber: 1122,
                                                                                                    columnNumber: 37
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    children: "Memuat policy..."
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                                    lineNumber: 1123,
                                                                                                    columnNumber: 37
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                            lineNumber: 1121,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    }, "loading", false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1114,
                                                                                        columnNumber: 33
                                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                                        initial: {
                                                                                            opacity: 0
                                                                                        },
                                                                                        animate: {
                                                                                            opacity: 1
                                                                                        },
                                                                                        exit: {
                                                                                            opacity: 0
                                                                                        },
                                                                                        className: "px-4 py-4 text-sm text-gray-500",
                                                                                        children: "Tidak ada policy yang cocok"
                                                                                    }, "empty", false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1127,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                    lineNumber: 1079,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                lookupLoading && policyOptions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                                    initial: {
                                                                                        opacity: 0
                                                                                    },
                                                                                    animate: {
                                                                                        opacity: 1
                                                                                    },
                                                                                    exit: {
                                                                                        opacity: 0
                                                                                    },
                                                                                    className: "border-t border-gray-100 px-4 py-3 text-xs text-gray-500",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "flex items-center gap-3",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                                lineNumber: 1147,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                children: "Memuat data tambahan..."
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                                lineNumber: 1148,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1146,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                    lineNumber: 1140,
                                                                                    columnNumber: 31
                                                                                }, this) : null
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                            lineNumber: 1074,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1067,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1052,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                        lineNumber: 1048,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "md:col-span-2 self-end",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "checkbox",
                                                                    checked: applyToChilds,
                                                                    onChange: ()=>undefined,
                                                                    disabled: true,
                                                                    className: "h-4 w-4 rounded border-gray-300 text-emerald-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                    lineNumber: 1181,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Apply to Childs"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                    lineNumber: 1189,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                            lineNumber: 1180,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                        lineNumber: 1179,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                lineNumber: 1027,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 gap-4 md:grid-cols-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "md:col-span-2 grid grid-cols-1 gap-4 xl:grid-cols-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                                className: "rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mb-4 flex items-start justify-between gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                        className: "text-base font-semibold text-gray-800",
                                                                                        children: "Current Credit Profile"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1199,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mt-1 text-xs text-gray-500",
                                                                                        children: "Data saat ini dari policy yang dipilih."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1202,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                lineNumber: 1198,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaInfoCircle"], {
                                                                                        className: "h-3 w-3"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1207,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    currentProfileLoading ? "Memuat..." : "Aktif"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                lineNumber: 1206,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1197,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-xl border border-gray-200 bg-white p-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400",
                                                                                        children: "Current Credit Limit"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1214,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mt-2 text-lg font-semibold text-slate-800",
                                                                                        children: currentProfileLoading ? "Memuat..." : currentProfile ? `Rp ${formatCurrency(currentProfile.creditLimit)}` : "-"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1217,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                lineNumber: 1213,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-xl border border-gray-200 bg-white p-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400",
                                                                                        children: "Current Payment Term"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1227,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mt-2 text-lg font-semibold text-slate-800",
                                                                                        children: currentProfileLoading ? "Memuat..." : currentProfile ? formatDays(currentProfile.paymentTerm) : "-"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1230,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                lineNumber: 1226,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-xl border border-gray-200 bg-white p-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400",
                                                                                        children: "Current Limit Customer Overdue"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1240,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mt-2 text-lg font-semibold text-slate-800",
                                                                                        children: currentProfileLoading ? "Memuat..." : currentProfile ? formatDays(currentProfile.limitCustomerOverdue) : "-"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1243,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                lineNumber: 1239,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-xl border border-gray-200 bg-white p-4 sm:col-span-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400",
                                                                                        children: "Policy ID"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1266,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mt-2 text-sm font-medium text-slate-700",
                                                                                        children: selectedPolicyLabel
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1269,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                lineNumber: 1265,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1212,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1196,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                                className: "rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mb-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                className: "text-base font-semibold text-gray-800",
                                                                                children: "Requested Changes"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                lineNumber: 1278,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "mt-1 text-xs text-gray-500",
                                                                                children: "Isi hanya nilai yang ingin diubah."
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                lineNumber: 1281,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1277,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                        className: "mb-1 block text-sm font-semibold text-gray-700",
                                                                                        children: "Requested Credit Limit"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1288,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        type: "text",
                                                                                        value: requestedCreditLimit,
                                                                                        onChange: (e)=>setRequestedCreditLimit(normalizeCurrencyInput(e.target.value)),
                                                                                        disabled: saving,
                                                                                        placeholder: "Contoh: 1.000.000",
                                                                                        className: "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1291,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                lineNumber: 1287,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                                className: "mb-1 block text-sm font-semibold text-gray-700",
                                                                                                children: "Requested Payment Term"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                                lineNumber: 1307,
                                                                                                columnNumber: 29
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                type: "number",
                                                                                                min: "0",
                                                                                                value: requestedPaymentTerm,
                                                                                                onChange: (e)=>setRequestedPaymentTerm(e.target.value),
                                                                                                disabled: saving,
                                                                                                placeholder: "Hari",
                                                                                                className: "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                                lineNumber: 1310,
                                                                                                columnNumber: 29
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1306,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                                className: "mb-1 block text-sm font-semibold text-gray-700",
                                                                                                children: "Requested Limit Customer Overdue"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                                lineNumber: 1324,
                                                                                                columnNumber: 29
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                type: "number",
                                                                                                min: "0",
                                                                                                value: requestedLimitCustomerOverdue,
                                                                                                onChange: (e)=>setRequestedLimitCustomerOverdue(e.target.value),
                                                                                                disabled: saving,
                                                                                                placeholder: "Hari",
                                                                                                className: "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                                lineNumber: 1327,
                                                                                                columnNumber: 29
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1323,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                lineNumber: 1305,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                        className: "mb-1 block text-sm font-semibold text-gray-700",
                                                                                        children: "Reason"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1342,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                                        value: reason,
                                                                                        onChange: (e)=>setReason(e.target.value),
                                                                                        disabled: saving,
                                                                                        rows: 6,
                                                                                        placeholder: "Jelaskan alasan pengajuan perubahan credit",
                                                                                        className: "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                        lineNumber: 1345,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                lineNumber: 1341,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1286,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1276,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                        lineNumber: 1195,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "md:col-span-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                            className: "rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-4 flex items-start justify-between gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                    className: "text-base font-semibold text-gray-800",
                                                                                    children: "Customer Yang Akan Mengikuti Credit Limit Ini"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                    lineNumber: 1362,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "mt-1 text-xs text-gray-500",
                                                                                    children: "Daftar customer dalam hierarchy policy yang dipilih."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                    lineNumber: 1365,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                            lineNumber: 1361,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100",
                                                                            children: affectedBranchesLoading ? "Memuat..." : `${affectedBranches.length} customer`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                            lineNumber: 1369,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                    lineNumber: 1360,
                                                                    columnNumber: 23
                                                                }, this),
                                                                !policyId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-xl border border-dashed border-indigo-200 bg-white/70 p-4 text-sm text-slate-500",
                                                                    children: "Pilih policy lebih dulu untuk melihat customer yang akan mengikuti credit limit ini."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                    lineNumber: 1377,
                                                                    columnNumber: 25
                                                                }, this) : affectedBranchesError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700",
                                                                    children: affectedBranchesError
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                    lineNumber: 1382,
                                                                    columnNumber: 25
                                                                }, this) : affectedBranchesLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-xl border border-indigo-100 bg-white/70 p-4 text-sm text-slate-500",
                                                                    children: "Memuat daftar customer cabang..."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                    lineNumber: 1386,
                                                                    columnNumber: 25
                                                                }, this) : affectedBranches.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-1 gap-3 lg:grid-cols-2",
                                                                    children: affectedBranches.map((branch)=>{
                                                                        const gcName = branch._relations?.gcid?.gc_name?.trim() || "-";
                                                                        const city = branch._relations?.branch?.city?.trim() || "-";
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "rounded-xl border border-indigo-100 bg-white p-4",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-bold text-slate-900",
                                                                                    children: [
                                                                                        gcName,
                                                                                        " - ",
                                                                                        city
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                    lineNumber: 1402,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "mt-1 text-sm font-semibold text-indigo-700",
                                                                                    children: branch.name || "-"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                                    lineNumber: 1405,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, branch.id, true, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                            lineNumber: 1398,
                                                                            columnNumber: 31
                                                                        }, this);
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                    lineNumber: 1390,
                                                                    columnNumber: 25
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-xl border border-dashed border-indigo-200 bg-white/70 p-4 text-sm text-slate-500",
                                                                    children: "Tidak ada customer cabang dalam cakupan policy ini."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                    lineNumber: 1413,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                            lineNumber: 1359,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                        lineNumber: 1358,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "md:col-span-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "mb-1 block text-sm font-semibold text-gray-700",
                                                                children: "Apply to Childs"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1421,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        checked: applyToChilds,
                                                                        onChange: ()=>undefined,
                                                                        disabled: true,
                                                                        className: "h-4 w-4 rounded border-gray-300 text-emerald-600"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1425,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Apply to Childs"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1433,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1424,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                        lineNumber: 1420,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "mb-1 block text-sm font-semibold text-gray-700",
                                                                children: "Identity Attachment"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1441,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm text-gray-600 transition hover:border-emerald-300 hover:bg-white",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaImage"], {
                                                                        className: "h-4 w-4 text-emerald-600"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1445,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex-1",
                                                                        children: identityAttachment ? identityAttachment.name : "Pilih gambar attachment untuk pengajuan credit"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1446,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700",
                                                                        children: "Upload"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1451,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "file",
                                                                        accept: "image/*",
                                                                        disabled: saving,
                                                                        className: "hidden",
                                                                        onChange: (event)=>{
                                                                            const file = event.target.files?.[0] || null;
                                                                            setIdentityAttachment(file);
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1454,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1444,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-1 text-xs text-gray-500",
                                                                children: "Attachment ini akan dikirim sebagai `identity_attachment`."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1465,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                        lineNumber: 1440,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "mb-1 block text-sm font-semibold text-gray-700",
                                                                children: "Customer Approval Attachment"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1471,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mb-3 flex justify-end",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>{
                                                                        setWaPreviewOpen(true);
                                                                    },
                                                                    disabled: !policyId,
                                                                    className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaPaperPlane"], {
                                                                            className: "h-4 w-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                            lineNumber: 1483,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        "Generate Teks WA"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                    lineNumber: 1475,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1474,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm text-gray-600 transition hover:border-emerald-300 hover:bg-white",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaImage"], {
                                                                        className: "h-4 w-4 text-emerald-600"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1488,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex-1",
                                                                        children: customerApprovalAttachment ? customerApprovalAttachment.name : "Pilih gambar approval customer"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1489,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700",
                                                                        children: "Upload"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1494,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "file",
                                                                        accept: "image/*",
                                                                        disabled: saving,
                                                                        className: "hidden",
                                                                        onChange: (event)=>{
                                                                            const file = event.target.files?.[0] || null;
                                                                            setCustomerApprovalAttachment(file);
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                        lineNumber: 1497,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1487,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-1 text-xs text-gray-500",
                                                                children: "Attachment ini akan dikirim sebagai `customer_approval_attachment`."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                                lineNumber: 1508,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                        lineNumber: 1470,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                lineNumber: 1194,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                        lineNumber: 1019,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                    lineNumber: 1018,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: onClose,
                                            disabled: saving,
                                            className: "rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50",
                                            children: "Batal"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                            lineNumber: 1518,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: saving,
                                            className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSave"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                    lineNumber: 1531,
                                                    columnNumber: 17
                                                }, this),
                                                saving ? "Menyimpan..." : "Simpan Request"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                            lineNumber: 1526,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                    lineNumber: 1517,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                            lineNumber: 1017,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                    lineNumber: 986,
                    columnNumber: 9
                }, this)
            }, "credit-change-request-form-modal", false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                lineNumber: 982,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: waPreviewOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            scale: 0.96,
                            y: 12
                        },
                        animate: {
                            opacity: 1,
                            scale: 1,
                            y: 0
                        },
                        exit: {
                            opacity: 0,
                            scale: 0.96,
                            y: 12
                        },
                        className: "w-full max-w-2xl rounded-2xl bg-white shadow-2xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between border-b border-slate-200 px-6 py-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-bold text-slate-900",
                                                children: "Preview Teks WhatsApp"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                lineNumber: 1552,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm text-slate-500",
                                                children: "Teks ini siap disalin untuk dikirim ke customer."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                lineNumber: 1555,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                        lineNumber: 1551,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setWaPreviewOpen(false),
                                        className: "rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTimes"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                            lineNumber: 1564,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                        lineNumber: 1559,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                lineNumber: 1550,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4 px-6 py-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        readOnly: true,
                                        value: waText,
                                        rows: 14,
                                        className: "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                        lineNumber: 1568,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-end gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setWaPreviewOpen(false),
                                                className: "rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50",
                                                children: "Tutup"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                lineNumber: 1575,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: async ()=>{
                                                    try {
                                                        await copyToClipboard(waText);
                                                        setError(null);
                                                        setWaPreviewOpen(false);
                                                    } catch (copyError) {
                                                        setError(copyError instanceof Error ? copyError.message : "Gagal menyalin teks WhatsApp");
                                                    }
                                                },
                                                className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCopy"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                        lineNumber: 1599,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Copy"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                                lineNumber: 1582,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                        lineNumber: 1574,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                                lineNumber: 1567,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                        lineNumber: 1544,
                        columnNumber: 13
                    }, this)
                }, "credit-change-request-wa-preview-modal", false, {
                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                    lineNumber: 1540,
                    columnNumber: 11
                }, this)
            }, "credit-change-request-wa-preview", false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
                lineNumber: 1538,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx",
        lineNumber: 981,
        columnNumber: 5
    }, this);
}
_s(CreditChangeRequestFormModal, "KIxvkvYa4/YOR4TTm5J53aRcK/s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = CreditChangeRequestFormModal;
var _c;
__turbopack_context__.k.register(_c, "CreditChangeRequestFormModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreditChangeRequestList",
    ()=>CreditChangeRequestList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/fetchAllQueryRows.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$CreditChangeRequestDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/customers/credit-change-request/CreditChangeRequestDetailModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$CreditChangeRequestFormModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/customers/credit-change-request/CreditChangeRequestFormModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/customers/credit-change-request/utils.ts [app-client] (ecmascript)");
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
;
;
const DEFAULT_PAGE_SIZE = 20;
function resolveUserName(explicitName, value) {
    if (explicitName) return explicitName;
    if (value && typeof value === "object" && value.full_name) {
        return value.full_name;
    }
    if (typeof value === "number") return `User ${value}`;
    return "System";
}
function formatCurrency(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return "-";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 2
    }).format(value);
}
function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
function formatDays(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return "-";
    return `${value} hari`;
}
function getStatusTone(status) {
    const normalized = status.toLowerCase();
    if (normalized === "approved") {
        return "bg-green-100 text-green-700 border-green-200";
    }
    if (normalized === "rejected") {
        return "bg-red-100 text-red-700 border-red-200";
    }
    if (normalized === "request" || normalized === "requested") {
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
    if (normalized === "draft") {
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
}
function mapCreditChangeRequestRow(row) {
    return {
        id: Number(row.id),
        code: row.name || `CCR-${row.id}`,
        policyType: String(row.policy_type || "").trim().toLowerCase(),
        policyTypeLabel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["policyTypeLabel"])(row.policy_type),
        policyId: Number(row.policy_id || 0),
        applyToChilds: Boolean(Number(row.apply_to_childs || 0)),
        currentCreditLimit: row.current_credit_limit ?? null,
        requestedCreditLimit: row.requested_credit_limit ?? null,
        currentPaymentTerm: row.current_payment_term ?? null,
        requestedPaymentTerm: row.requested_payment_term ?? null,
        currentLimitCustomerOverdue: row.current_limit_customer_overdue ?? null,
        requestedLimitCustomerOverdue: row.requested_limit_customer_overdue ?? null,
        identityAttachment: row.identity_attachment || null,
        customerApprovalAttachment: row.customer_approval_attachment || null,
        reason: row.reason || null,
        rejectedNote: row.rejected_note || null,
        sagaStatus: row.saga_status || null,
        syncSagaId: row.sync_saga_id || null,
        syncLastError: row.sync_last_error || null,
        syncLastRollbackError: row.sync_last_rollback_error || null,
        status: row.status || "Draft",
        docstatus: Number(row.docstatus || 0),
        workflowState: row.workflow_state || null,
        created_at: row.created_at || null,
        updated_at: row.updated_at || row.created_at || null,
        createdAt: row.created_at || new Date(0).toISOString(),
        updatedAt: row.updated_at || row.created_at || new Date(0).toISOString(),
        createdBy: resolveUserName(row["created_by.full_name"], row.created_by),
        updatedBy: resolveUserName(row["updated_by.full_name"], row.updated_by)
    };
}
function CreditChangeRequestList() {
    _s();
    const { token, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadingMore, setLoadingMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedItem, setSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sortField, setSortField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("updated_at");
    const [sortDirection, setSortDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("desc");
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [hasMore, setHasMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [policyNameMap, setPolicyNameMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const loadMoreRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestList.useEffect": ()=>{
            const timer = window.setTimeout({
                "CreditChangeRequestList.useEffect.timer": ()=>{
                    setDebouncedSearchQuery(searchQuery.trim());
                }
            }["CreditChangeRequestList.useEffect.timer"], 300);
            return ({
                "CreditChangeRequestList.useEffect": ()=>{
                    window.clearTimeout(timer);
                }
            })["CreditChangeRequestList.useEffect"];
        }
    }["CreditChangeRequestList.useEffect"], [
        searchQuery
    ]);
    const loadData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CreditChangeRequestList.useCallback[loadData]": async (page, replace = false)=>{
            if (replace) {
                setLoading(true);
                setError(null);
            } else {
                setLoadingMore(true);
            }
            try {
                if (!token || !isAuthenticated) {
                    setItems([]);
                    setHasMore(false);
                    return;
                }
                if (debouncedSearchQuery) {
                    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
                        endpoint: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CREDIT_CHANGE_REQUEST,
                        spec: {
                            fields: [
                                "*",
                                "created_by.full_name",
                                "updated_by.full_name"
                            ],
                            order_by: sortField === "status" ? [
                                [
                                    "status",
                                    sortDirection
                                ]
                            ] : [
                                [
                                    sortField,
                                    sortDirection
                                ]
                            ]
                        },
                        token,
                        errorMessage: "Failed to fetch credit change request"
                    });
                    setItems(rows.map(mapCreditChangeRequestRow));
                    setCurrentPage(1);
                    setHasMore(false);
                    return;
                }
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CREDIT_CHANGE_REQUEST, {
                    fields: [
                        "*",
                        "created_by.full_name",
                        "updated_by.full_name"
                    ],
                    page,
                    order_by: sortField === "status" ? [
                        [
                            "status",
                            sortDirection
                        ]
                    ] : [
                        [
                            sortField,
                            sortDirection
                        ]
                    ]
                }), {
                    method: "GET",
                    cache: "no-store"
                }, token);
                if (!response.ok) {
                    throw new Error(`Failed to fetch credit change request (${response.status})`);
                }
                const json = await response.json();
                const rows = Array.isArray(json?.data) ? json.data : [];
                const perPage = Number(json?.meta?.per_page || DEFAULT_PAGE_SIZE);
                const mapped = rows.map(mapCreditChangeRequestRow);
                setItems({
                    "CreditChangeRequestList.useCallback[loadData]": (current)=>replace ? mapped : [
                            ...current,
                            ...mapped.filter({
                                "CreditChangeRequestList.useCallback[loadData]": (item)=>!current.some({
                                        "CreditChangeRequestList.useCallback[loadData]": (existing)=>existing.id === item.id
                                    }["CreditChangeRequestList.useCallback[loadData]"])
                            }["CreditChangeRequestList.useCallback[loadData]"])
                        ]
                }["CreditChangeRequestList.useCallback[loadData]"]);
                setCurrentPage(page);
                setHasMore(rows.length >= perPage);
            } catch (loadError) {
                if (replace) {
                    setItems([]);
                }
                setHasMore(false);
                setError(loadError instanceof Error ? loadError.message : "Gagal memuat credit change request");
            } finally{
                if (replace) {
                    setLoading(false);
                } else {
                    setLoadingMore(false);
                }
            }
        }
    }["CreditChangeRequestList.useCallback[loadData]"], [
        debouncedSearchQuery,
        isAuthenticated,
        sortDirection,
        sortField,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestList.useEffect": ()=>{
            setCurrentPage(1);
            setHasMore(true);
            void loadData(1, true);
        }
    }["CreditChangeRequestList.useEffect"], [
        loadData
    ]);
    const refreshList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CreditChangeRequestList.useCallback[refreshList]": async ()=>{
            setCurrentPage(1);
            setHasMore(true);
            await loadData(1, true);
        }
    }["CreditChangeRequestList.useCallback[refreshList]"], [
        loadData
    ]);
    const filteredItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreditChangeRequestList.useMemo[filteredItems]": ()=>{
            const query = debouncedSearchQuery.trim().toLowerCase();
            if (!query) return items;
            return items.filter({
                "CreditChangeRequestList.useMemo[filteredItems]": (item)=>{
                    const policyKey = `${item.policyType}:${item.policyId || 0}`;
                    const policyName = policyNameMap[policyKey] || "";
                    return item.code.toLowerCase().includes(query) || item.policyTypeLabel.toLowerCase().includes(query) || item.status.toLowerCase().includes(query) || (item.reason || "").toLowerCase().includes(query) || policyName.toLowerCase().includes(query);
                }
            }["CreditChangeRequestList.useMemo[filteredItems]"]);
        }
    }["CreditChangeRequestList.useMemo[filteredItems]"], [
        debouncedSearchQuery,
        items,
        policyNameMap
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestList.useEffect": ()=>{
            let cancelled = false;
            async function loadVisiblePolicyNames() {
                if (!token || !isAuthenticated || items.length === 0) {
                    return;
                }
                const itemsToResolve = items.filter({
                    "CreditChangeRequestList.useEffect.loadVisiblePolicyNames.itemsToResolve": (item)=>{
                        const key = `${item.policyType}:${item.policyId || 0}`;
                        return Boolean(item.policyId) && !policyNameMap[key];
                    }
                }["CreditChangeRequestList.useEffect.loadVisiblePolicyNames.itemsToResolve"]);
                if (itemsToResolve.length === 0) {
                    return;
                }
                const resolvedEntries = await Promise.allSettled(itemsToResolve.map({
                    "CreditChangeRequestList.useEffect.loadVisiblePolicyNames": async (item)=>{
                        const key = `${item.policyType}:${item.policyId || 0}`;
                        const label = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolvePolicyDisplayName"])({
                            token,
                            policyType: item.policyType,
                            policyId: item.policyId
                        });
                        return [
                            key,
                            label
                        ];
                    }
                }["CreditChangeRequestList.useEffect.loadVisiblePolicyNames"]));
                if (!cancelled) {
                    setPolicyNameMap({
                        "CreditChangeRequestList.useEffect.loadVisiblePolicyNames": (current)=>{
                            const next = {
                                ...current
                            };
                            resolvedEntries.forEach({
                                "CreditChangeRequestList.useEffect.loadVisiblePolicyNames": (result, index)=>{
                                    const fallbackItem = itemsToResolve[index];
                                    const key = `${fallbackItem.policyType}:${fallbackItem.policyId || 0}`;
                                    if (result.status === "fulfilled") {
                                        next[key] = result.value[1];
                                        return;
                                    }
                                    next[key] = fallbackItem.policyId ? `${fallbackItem.policyTypeLabel} #${fallbackItem.policyId}` : fallbackItem.policyTypeLabel;
                                }
                            }["CreditChangeRequestList.useEffect.loadVisiblePolicyNames"]);
                            return next;
                        }
                    }["CreditChangeRequestList.useEffect.loadVisiblePolicyNames"]);
                }
            }
            void loadVisiblePolicyNames();
            return ({
                "CreditChangeRequestList.useEffect": ()=>{
                    cancelled = true;
                }
            })["CreditChangeRequestList.useEffect"];
        }
    }["CreditChangeRequestList.useEffect"], [
        isAuthenticated,
        items,
        policyNameMap,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreditChangeRequestList.useEffect": ()=>{
            const target = loadMoreRef.current;
            if (!target || loading || loadingMore || !hasMore) return;
            const observer = new IntersectionObserver({
                "CreditChangeRequestList.useEffect": (entries)=>{
                    const [entry] = entries;
                    if (!entry?.isIntersecting) return;
                    void loadData(currentPage + 1, false);
                }
            }["CreditChangeRequestList.useEffect"], {
                root: null,
                rootMargin: "240px 0px",
                threshold: 0
            });
            observer.observe(target);
            return ({
                "CreditChangeRequestList.useEffect": ()=>{
                    observer.disconnect();
                }
            })["CreditChangeRequestList.useEffect"];
        }
    }["CreditChangeRequestList.useEffect"], [
        currentPage,
        hasMore,
        loadData,
        loading,
        loadingMore
    ]);
    const sortOptions = [
        {
            value: "updated_at",
            label: "Tanggal Update"
        },
        {
            value: "created_at",
            label: "Tanggal Buat"
        },
        {
            value: "status",
            label: "Status"
        }
    ];
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CreditChangeRequestList.useCallback[handleSave]": async (payload)=>{
            if (!token) throw new Error("Not authenticated");
            setSaving(true);
            try {
                const formData = new FormData();
                formData.append("policy_type", payload.policyType);
                formData.append("policy_id", String(payload.policyId));
                formData.append("apply_to_childs", payload.applyToChilds ? "1" : "0");
                formData.append("reason", payload.reason);
                if (payload.requestedCreditLimit !== undefined) {
                    formData.append("requested_credit_limit", String(payload.requestedCreditLimit));
                }
                if (payload.requestedPaymentTerm !== undefined) {
                    formData.append("requested_payment_term", String(payload.requestedPaymentTerm));
                }
                if (payload.requestedLimitCustomerOverdue !== undefined) {
                    formData.append("requested_limit_customer_overdue", String(payload.requestedLimitCustomerOverdue));
                }
                if (payload.identityAttachment) {
                    formData.append("identity_attachment", payload.identityAttachment);
                }
                if (payload.customerApprovalAttachment) {
                    formData.append("customer_approval_attachment", payload.customerApprovalAttachment);
                }
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getResourceUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CREDIT_CHANGE_REQUEST), {
                    method: "POST",
                    headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthHeadersFormData"])(token),
                    body: formData,
                    cache: "no-store"
                }, token);
                if (!response.ok) {
                    const saveJson = await response.json().catch({
                        "CreditChangeRequestList.useCallback[handleSave]": ()=>({})
                    }["CreditChangeRequestList.useCallback[handleSave]"]);
                    throw new Error(saveJson?.message || `Failed to create credit change request (${response.status})`);
                }
                setModalOpen(false);
                await refreshList();
            } finally{
                setSaving(false);
            }
        }
    }["CreditChangeRequestList.useCallback[handleSave]"], [
        refreshList,
        token
    ]);
    if (loading && items.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center py-20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-16 w-16 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"
            }, void 0, false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                lineNumber: 487,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
            lineNumber: 486,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-8 text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm font-medium",
                    children: [
                        "Error: ",
                        error
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                    lineNumber: 496,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                lineNumber: 495,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
            lineNumber: 494,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-gray-800 md:text-3xl",
                                children: "Credit Change Request"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                lineNumber: 506,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600 md:text-base",
                                children: "Kelola pengajuan perubahan credit limit dan payment term customer"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                lineNumber: 509,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                        lineNumber: 505,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setModalOpen(true),
                        className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-600 hover:to-teal-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaPlus"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                lineNumber: 518,
                                columnNumber: 11
                            }, this),
                            "Add New Request"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                        lineNumber: 513,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                lineNumber: 504,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-4 md:flex-row",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSearch"], {
                                    className: "absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                    lineNumber: 567,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: searchQuery,
                                    onChange: (event)=>setSearchQuery(event.target.value),
                                    placeholder: "Cari nama, policy type, status, atau alasan...",
                                    className: "w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                    lineNumber: 568,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                            lineNumber: 566,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: sortField,
                            onChange: (event)=>setSortField(event.target.value),
                            className: "rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 focus:border-transparent focus:ring-2 focus:ring-emerald-500",
                            children: sortOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: option.value,
                                    children: option.label
                                }, option.value, false, {
                                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                    lineNumber: 582,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                            lineNumber: 576,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setSortDirection((prev)=>prev === "asc" ? "desc" : "asc"),
                            className: "inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200",
                            children: sortDirection === "asc" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSortAmountUp"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                lineNumber: 595,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSortAmountDown"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                lineNumber: 597,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                            lineNumber: 587,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                    lineNumber: 565,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                lineNumber: 564,
                columnNumber: 7
            }, this),
            filteredItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSearch"], {
                            className: "h-8 w-8 text-gray-400"
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                            lineNumber: 606,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                        lineNumber: 605,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mb-2 text-lg font-semibold text-gray-800",
                        children: "Tidak ada credit change request"
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                        lineNumber: 608,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500",
                        children: searchQuery ? "Coba ubah kata kunci pencarian" : "Belum ada data credit change request"
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                        lineNumber: 611,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                lineNumber: 604,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",
                        children: filteredItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 16
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                whileHover: {
                                    y: -5,
                                    boxShadow: "0 18px 35px -15px rgba(16, 185, 129, 0.25)"
                                },
                                role: "button",
                                tabIndex: 0,
                                onClick: ()=>setSelectedItem(item),
                                onKeyDown: (event)=>{
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        setSelectedItem(item);
                                    }
                                },
                                className: "cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2",
                                children: (()=>{
                                    const policyKey = `${item.policyType}:${item.policyId || 0}`;
                                    const policyName = policyNameMap[policyKey] || item.policyTypeLabel;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-b border-gray-100 bg-gradient-to-br from-white via-emerald-50/30 to-white p-5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-4 flex items-start justify-between gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "min-w-0 flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "mt-2 truncate text-lg font-bold text-slate-900",
                                                                        children: policyName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                        lineNumber: 653,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1 text-sm text-slate-500",
                                                                        children: item.policyTypeLabel
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                        lineNumber: 656,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                lineNumber: 649,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(item.status)}`,
                                                                children: item.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                lineNumber: 660,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                        lineNumber: 648,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-2 gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-xl border border-emerald-100 bg-emerald-50 p-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-semibold uppercase tracking-wide text-emerald-700",
                                                                        children: "Current Credit Limit"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                        lineNumber: 705,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1 text-[var(--credit-limit-card-font-size,1.125rem)] font-bold leading-tight text-emerald-900",
                                                                        children: formatCurrency(item.currentCreditLimit)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                        lineNumber: 708,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                lineNumber: 704,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-xl border border-blue-100 bg-blue-50 p-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-semibold uppercase tracking-wide text-blue-700",
                                                                        children: "Requested Credit Limit"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                        lineNumber: 713,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1 text-[var(--credit-limit-card-font-size,1.125rem)] font-bold leading-tight text-blue-900",
                                                                        children: formatCurrency(item.requestedCreditLimit)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                        lineNumber: 716,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                lineNumber: 712,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                        lineNumber: 703,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                lineNumber: 647,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 p-5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-2 gap-3 text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-xl bg-slate-50 p-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-semibold  tracking-wide text-slate-500",
                                                                        children: "Current Term"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                        lineNumber: 726,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1 font-semibold text-slate-900",
                                                                        children: formatDays(item.currentPaymentTerm)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                        lineNumber: 729,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                lineNumber: 725,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-xl bg-slate-50 p-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-semibold  tracking-wide text-slate-500",
                                                                        children: "Requested Term"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                        lineNumber: 734,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1 font-semibold text-slate-900",
                                                                        children: formatDays(item.requestedPaymentTerm)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                        lineNumber: 737,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                lineNumber: 733,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                        lineNumber: 724,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-xl bg-slate-50 p-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-semibold  tracking-wide text-slate-500",
                                                                children: "Reason"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                lineNumber: 744,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-1 line-clamp-2 text-sm text-slate-700",
                                                                children: item.reason || item.rejectedNote || "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                lineNumber: 747,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                        lineNumber: 743,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between text-xs text-slate-500",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCalendarAlt"], {
                                                                        className: "h-3 w-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                        lineNumber: 754,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: formatDate(item.updatedAt)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                        lineNumber: 755,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                lineNumber: 753,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: item.updatedBy || item.createdBy || "System"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                lineNumber: 757,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                        lineNumber: 752,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: (event)=>{
                                                            event.stopPropagation();
                                                            setSelectedItem(item);
                                                        },
                                                        className: "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEye"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                                lineNumber: 770,
                                                                columnNumber: 27
                                                            }, this),
                                                            "View Details"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                        lineNumber: 762,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                                lineNumber: 723,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true);
                                })()
                            }, item.id, false, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                lineNumber: 621,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                        lineNumber: 619,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3 pt-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Showing ",
                                    filteredItems.length,
                                    " loaded requests",
                                    debouncedSearchQuery ? " matching current search" : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                lineNumber: 782,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: hasMore ? "Scroll ke bawah untuk memuat lebih banyak" : "Semua data yang tersedia sudah dimuat"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                                lineNumber: 786,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                        lineNumber: 781,
                        columnNumber: 11
                    }, this),
                    hasMore ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: loadMoreRef,
                        className: "flex h-16 items-center justify-center text-sm text-slate-400",
                        children: loadingMore ? "Memuat data berikutnya..." : "Siap memuat data berikutnya..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                        lineNumber: 794,
                        columnNumber: 13
                    }, this) : null
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$CreditChangeRequestDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreditChangeRequestDetailModal"], {
                isOpen: selectedItem !== null,
                onClose: ()=>setSelectedItem(null),
                item: selectedItem,
                onActionExecuted: refreshList
            }, void 0, false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                lineNumber: 804,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$customers$2f$credit$2d$change$2d$request$2f$CreditChangeRequestFormModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreditChangeRequestFormModal"], {
                open: modalOpen,
                onClose: ()=>{
                    if (saving) return;
                    setModalOpen(false);
                },
                onSave: handleSave,
                saving: saving
            }, void 0, false, {
                fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
                lineNumber: 810,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/customers/credit-change-request/CreditChangeRequestList.tsx",
        lineNumber: 503,
        columnNumber: 5
    }, this);
}
_s(CreditChangeRequestList, "nrjzmzs/eKRWLNr090ezD8ZCK1I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = CreditChangeRequestList;
var _c;
__turbopack_context__.k.register(_c, "CreditChangeRequestList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_b79f4141._.js.map