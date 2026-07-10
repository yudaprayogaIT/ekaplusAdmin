module.exports = [
"[project]/src/components/customers/registration/ApproveRegistrationModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApproveRegistrationModal",
    ()=>ApproveRegistrationModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/fetchAllQueryRows.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const referenceCache = new Map();
function normalizePhone(value) {
    if (!value) return undefined;
    const digits = value.replace(/\D/g, "");
    return digits || undefined;
}
function normalizeDate(value) {
    if (!value || value === "-") return undefined;
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return value.split("T")[0];
}
function normalizeEntityName(value) {
    if (!value) return "";
    return value.trim().replace(/\s+/g, " ").toUpperCase();
}
function toUpperInput(value) {
    return (value || "").toUpperCase();
}
function getInitialNbName(registration) {
    return normalizeEntityName(registration.master_links?.nb_manual || registration.user.full_name || registration.company.name || "");
}
function getInitialGpName(registration) {
    return normalizeEntityName(registration.master_links?.gp_manual || `${registration.user.full_name || registration.company.name} GP`);
}
function extractIdFromResourceResponse(json) {
    if (json && typeof json === "object" && "data" in json && json.data && typeof json.data === "object" && "id" in json.data) {
        const raw = json.data.id;
        if (typeof raw === "number") return raw;
        if (typeof raw === "string") {
            const parsed = Number.parseInt(raw, 10);
            if (Number.isFinite(parsed)) return parsed;
        }
    }
    return undefined;
}
function buildCreditPolicyPayload(source) {
    return {
        credit_limit_active: Number(source?.credit_limit_active || 0),
        credit_limit: source?.credit_limit === null || source?.credit_limit === undefined ? null : Number(source.credit_limit),
        payment_term_active: Number(source?.payment_term_active || 0),
        payment_term: source?.payment_term === null || source?.payment_term === undefined ? null : Number(source.payment_term),
        limit_customer_overdue_active: Number(source?.limit_customer_overdue_active || 0),
        limit_customer_overdue: source?.limit_customer_overdue === null || source?.limit_customer_overdue === undefined ? null : Number(source.limit_customer_overdue)
    };
}
function ApproveRegistrationModal({ isOpen, onClose, registration, onSuccess, demoMode = false }) {
    const { token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [createNationalBrand, setCreateNationalBrand] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [nbName, setNbName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [gpName, setGpName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [gcName, setGcName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPreparing, setIsPreparing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [operationLogs, setOperationLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shippingAddresses, setShippingAddresses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [nationalBrands, setNationalBrands] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [createdNb, setCreatedNb] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [existingGp, setExistingGp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [createdGp, setCreatedGp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [groupParents, setGroupParents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [groupCustomers, setGroupCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [createdGc, setCreatedGc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [branchCustomers, setBranchCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [createdBc, setCreatedBc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // --- GP state ---
    const [gpMode, setGpMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [gpSearch, setGpSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedGpid, setSelectedGpid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // --- GC state ---
    const [gcMode, setGcMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [gcSearch, setGcSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedGcid, setSelectedGcid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // --- BC state ---
    const [bcMode, setBcMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [bcSearch, setBcSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedBcid, setSelectedBcid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [nbSearch, setNbSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedNbid, setSelectedNbid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [createdNbid, setCreatedNbid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [createdGpid, setCreatedGpid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [createdGcid, setCreatedGcid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [createdBcid, setCreatedBcid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [gpCreatedViaCreateFlow, setGpCreatedViaCreateFlow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [nbCreatedViaCreateFlow, setNbCreatedViaCreateFlow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCloseConfirm, setShowCloseConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isGpLoading, setIsGpLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isGcLoading, setIsGcLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isBcLoading, setIsBcLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const demoNationalBrands = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                id: 9101,
                name: "NB9101",
                nb_name: "EKA TOUR"
            },
            {
                id: 9102,
                name: "NB9102",
                nb_name: "EKA DISTRIBUTOR"
            }
        ], []);
    const demoGroupParents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                id: 9201,
                name: "GP9201",
                gp_name: "DEMO SEJAHTERA GROUP",
                nbid: 9101
            },
            {
                id: 9202,
                name: "GP9202",
                gp_name: "SURABAYA RETAIL NETWORK",
                nbid: 9102
            }
        ], []);
    const demoGroupCustomers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                id: 9301,
                name: "GC9301",
                gc_name: "PT DEMO SEJAHTERA ABADI",
                gpid: 9201
            }
        ], []);
    const demoBranchCustomers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                id: 9401,
                name: "BC9401",
                bcid_name: "PT DEMO SEJAHTERA ABADI - SURABAYA",
                gcid: 9301,
                branch: {
                    id: 77,
                    branch_name: "Cabang Surabaya",
                    city: "Surabaya"
                },
                branch_owner: "Rina Wulandari",
                branch_owner_phone: "081298765432"
            }
        ], []);
    const existingGpid = registration?.gp_id;
    const existingGcid = registration?.gc_id;
    const existingBcid = registration?.bc_id;
    const existingNbid = registration?.master_links?.nb_id;
    const effectiveNbid = existingNbid || selectedNbid || undefined;
    const effectiveGpid = existingGpid || selectedGpid || undefined;
    const effectiveGcid = existingGcid || selectedGcid || undefined;
    const effectiveBcid = existingBcid || selectedBcid || undefined;
    const isCreatingNewGpFlow = Boolean(gpCreatedViaCreateFlow || !existingGpid && !selectedGpid && gpMode === "create");
    const canSearchExistingGc = Boolean(!isCreatingNewGpFlow && (existingGpid || selectedGpid));
    const canSearchExistingBc = Boolean(false);
    // ---- Filtered lists (only meaningful when mode === "search" and query is non-empty) ----
    const filteredGroupParents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const q = gpSearch.trim().toLowerCase();
        if (!q) return groupParents.slice(0, 20);
        return groupParents.filter((row)=>{
            const label = `${row.gp_name || ""} ${row.name || ""}`.toLowerCase();
            return label.includes(q);
        });
    }, [
        gpSearch,
        groupParents
    ]);
    const filteredNationalBrands = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const q = nbSearch.trim().toLowerCase();
        if (!q) return nationalBrands.slice(0, 20);
        return nationalBrands.filter((row)=>{
            const label = `${row.nb_name || ""} ${row.name || ""}`.toLowerCase();
            return label.includes(q);
        });
    }, [
        nbSearch,
        nationalBrands
    ]);
    const filteredGroupCustomers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const qGc = gcSearch.trim().toLowerCase();
        const effectiveGpidForFilter = canSearchExistingGc ? effectiveGpid : 0;
        const base = effectiveGpidForFilter ? groupCustomers.filter((row)=>Number(row.gpid || 0) === Number(effectiveGpidForFilter)) : groupCustomers;
        if (!qGc) return base.slice(0, 20);
        return base.filter((row)=>{
            const label = `${row.gc_name || ""} ${row.name || ""}`.toLowerCase();
            return label.includes(qGc);
        });
    }, [
        gcSearch,
        groupCustomers,
        effectiveGpid,
        canSearchExistingGc
    ]);
    const filteredBranchCustomers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const q = bcSearch.trim().toLowerCase();
        const effectiveGcidForFilter = canSearchExistingBc ? effectiveGcid : 0;
        const base = effectiveGcidForFilter ? branchCustomers.filter((row)=>Number(row.gcid || 0) === Number(effectiveGcidForFilter)) : branchCustomers;
        if (!q) return base.slice(0, 20);
        return base.filter((row)=>{
            const label = `${row.bcid_name || ""} ${row.name || ""}`.toLowerCase();
            return label.includes(q);
        });
    }, [
        bcSearch,
        branchCustomers,
        effectiveGcid,
        canSearchExistingBc
    ]);
    const effectiveShippingAddresses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!registration) return [];
        if (registration.same_as_company_address) {
            if (shippingAddresses.length > 0) {
                return shippingAddresses;
            }
            return [
                {
                    id: -1,
                    parent_id: Number(registration.id),
                    label: "Alamat Perusahaan",
                    address: registration.address.full_address,
                    city: registration.address.city_name,
                    province: registration.address.province_name,
                    district: registration.address.district_name,
                    village: registration.address.village_name,
                    pic_name: registration.branch_owner?.full_name || registration.user.full_name,
                    pic_phone: registration.branch_owner?.phone || registration.user.phone,
                    is_default: 1
                }
            ];
        }
        return shippingAddresses;
    }, [
        registration,
        shippingAddresses
    ]);
    const pushLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((log)=>{
        setOperationLogs((prev)=>[
                ...prev,
                log
            ]);
    }, []);
    const apiJsonRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (stage, url, method, body)=>{
        if (demoMode) {
            pushLog({
                stage,
                status: "started",
                message: `[Tour] ${method} ${url}`,
                payload: body
            });
            const lowerStage = stage.toLowerCase();
            let demoResponse = {
                data: {}
            };
            if (lowerStage.includes("national brand")) {
                demoResponse = {
                    data: {
                        id: 9101,
                        name: "NB9101",
                        nb_name: "EKA TOUR"
                    }
                };
            } else if (lowerStage.includes("group parent")) {
                demoResponse = {
                    data: {
                        id: 9201,
                        name: "GP9201",
                        gp_name: "DEMO SEJAHTERA GROUP",
                        nbid: 9101
                    }
                };
            } else if (lowerStage.includes("group customer")) {
                demoResponse = {
                    data: {
                        id: 9301,
                        name: "GC9301",
                        gc_name: "PT DEMO SEJAHTERA ABADI",
                        gpid: 9201
                    }
                };
            }
            pushLog({
                stage,
                status: "success",
                message: `${stage} success (tour demo)`,
                response: demoResponse,
                http_status: 200
            });
            return demoResponse;
        }
        pushLog({
            stage,
            status: "started",
            message: `${method} ${url}`,
            payload: body
        });
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])(url, {
            method,
            cache: "no-store",
            ...body ? {
                body: JSON.stringify(body)
            } : {}
        }, token);
        let json = null;
        try {
            json = await res.json();
        } catch  {
            json = null;
        }
        if (!res.ok) {
            const serverMessage = json && typeof json === "object" && "message" in json && typeof json.message === "string" ? json.message : "";
            const message = `Failed ${stage} (HTTP ${res.status})${serverMessage ? `: ${serverMessage}` : ""}`;
            pushLog({
                stage,
                status: "failed",
                message,
                response: json,
                http_status: res.status
            });
            throw new Error(message);
        }
        pushLog({
            stage,
            status: "success",
            message: `${stage} success`,
            response: json,
            http_status: res.status
        });
        return json;
    }, [
        demoMode,
        pushLog,
        token
    ]);
    const getReferenceCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!token) return null;
        const cached = referenceCache.get(token);
        if (cached) return cached;
        const next = {
            nationalBrands: undefined,
            groupParents: undefined,
            groupCustomersByGpid: new Map(),
            branchCustomersByGcid: new Map()
        };
        referenceCache.set(token, next);
        return next;
    }, [
        token
    ]);
    const ensureNationalBrands = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (demoMode) {
            setNationalBrands(demoNationalBrands);
            return;
        }
        if (!token) return;
        const cache = getReferenceCache();
        if (!cache) return;
        if (!cache.nationalBrands) {
            cache.nationalBrands = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
                endpoint: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.NATIONAL_BRAND,
                spec: {
                    fields: [
                        "id",
                        "name",
                        "nb_name"
                    ]
                },
                token,
                errorMessage: "Failed to fetch NB reference list"
            });
        }
        setNationalBrands(cache.nationalBrands || []);
    }, [
        demoMode,
        demoNationalBrands,
        getReferenceCache,
        token
    ]);
    const ensureGroupParents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (demoMode) {
            setGroupParents(demoGroupParents);
            return;
        }
        if (!token) return;
        const cache = getReferenceCache();
        if (!cache) return;
        if (!cache.groupParents) {
            setIsGpLoading(true);
            try {
                cache.groupParents = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
                    endpoint: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_PARENT,
                    spec: {
                        fields: [
                            "id",
                            "name",
                            "gp_name",
                            "nbid"
                        ]
                    },
                    token,
                    errorMessage: "Failed to fetch GP reference list"
                });
            } finally{
                setIsGpLoading(false);
            }
        }
        setGroupParents(cache.groupParents || []);
    }, [
        demoGroupParents,
        demoMode,
        getReferenceCache,
        token
    ]);
    const ensureGroupCustomers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (gpid)=>{
        if (demoMode) {
            setGroupCustomers(demoGroupCustomers.filter((row)=>!gpid || Number(row.gpid || 0) === Number(gpid)));
            return;
        }
        if (!token || !gpid) {
            setGroupCustomers([]);
            return;
        }
        const cache = getReferenceCache();
        if (!cache) return;
        const cachedRows = cache.groupCustomersByGpid.get(gpid);
        if (cachedRows) {
            setGroupCustomers(cachedRows);
            return;
        }
        setIsGcLoading(true);
        try {
            const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
                endpoint: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_CUSTOMER,
                spec: {
                    fields: [
                        "id",
                        "name",
                        "gc_name",
                        "gpid"
                    ],
                    filters: [
                        [
                            "gpid",
                            "=",
                            gpid
                        ]
                    ]
                },
                token,
                errorMessage: "Failed to fetch GC reference list"
            });
            cache.groupCustomersByGpid.set(gpid, rows);
            setGroupCustomers(rows);
        } finally{
            setIsGcLoading(false);
        }
    }, [
        demoGroupCustomers,
        demoMode,
        getReferenceCache,
        token
    ]);
    const ensureBranchCustomers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (gcid)=>{
        if (demoMode) {
            setBranchCustomers(demoBranchCustomers.filter((row)=>!gcid || Number(row.gcid || 0) === Number(gcid)));
            return;
        }
        if (!token || !gcid) {
            setBranchCustomers([]);
            return;
        }
        const cache = getReferenceCache();
        if (!cache) return;
        const cachedRows = cache.branchCustomersByGcid.get(gcid);
        if (cachedRows) {
            setBranchCustomers(cachedRows);
            return;
        }
        setIsBcLoading(true);
        try {
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
                            gcid
                        ]
                    ]
                },
                token,
                errorMessage: "Failed to fetch BC reference list"
            });
            cache.branchCustomersByGcid.set(gcid, rows);
            setBranchCustomers(rows);
        } finally{
            setIsBcLoading(false);
        }
    }, [
        demoBranchCustomers,
        demoMode,
        getReferenceCache,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        async function loadPreparationData() {
            if (!isOpen || !registration) return;
            setStep(1);
            const initialNbName = getInitialNbName(registration);
            const initialGpName = getInitialGpName(registration);
            const shouldCreateNationalBrand = Boolean(!existingNbid && registration.master_links?.nb_manual);
            const shouldCreateGroupParent = Boolean(!registration.gp_id && registration.master_links?.gp_manual);
            setCreateNationalBrand(shouldCreateNationalBrand);
            setNbName(initialNbName);
            setGpName(initialGpName);
            setGcName(normalizeEntityName(registration.company.name || ""));
            setIsSubmitting(false);
            setError(null);
            setOperationLogs([]);
            setNationalBrands([]);
            setExistingGp(null);
            setCreatedGp(null);
            setCreatedNb(null);
            setCreatedGc(null);
            setCreatedBc(null);
            setGroupParents([]);
            setGroupCustomers([]);
            setBranchCustomers([]);
            setNbSearch("");
            setSelectedNbid(existingNbid || null);
            setCreatedNbid(null);
            setCreatedGpid(null);
            setCreatedGcid(null);
            setCreatedBcid(null);
            setCreatedNb(null);
            setCreatedGc(null);
            setCreatedBc(null);
            setGpCreatedViaCreateFlow(false);
            setNbCreatedViaCreateFlow(false);
            setIsGpLoading(false);
            setIsGcLoading(false);
            setIsBcLoading(false);
            // Reset all modes & searches
            setGpMode(shouldCreateGroupParent ? "create" : "search");
            setGpSearch("");
            setSelectedGpid(null);
            setGcMode("idle");
            setGcSearch("");
            setSelectedGcid(null);
            setBcMode("idle");
            setBcSearch("");
            setSelectedBcid(null);
            setIsPreparing(true);
            try {
                if (demoMode) {
                    setShippingAddresses((registration.shipping_addresses || []).map((item, index)=>({
                            id: item.id || index + 1,
                            parent_id: Number(registration.id) || index + 1,
                            label: item.label,
                            address: item.address,
                            city: item.city,
                            province: item.province,
                            district: item.district || null,
                            village: item.village || null,
                            postal_code: item.postal_code || null,
                            pic_name: item.pic_name || null,
                            pic_phone: item.pic_phone || null,
                            is_default: item.is_default || null
                        })));
                    setNationalBrands(demoNationalBrands);
                    setGroupParents(demoGroupParents);
                    setExistingGp(null);
                    setSelectedNbid(null);
                    setSelectedGpid(null);
                    setSelectedGcid(null);
                    setSelectedBcid(null);
                    setCreateNationalBrand(false);
                    setGpMode("search");
                    setGcMode("idle");
                    setBcMode("idle");
                    return;
                }
                if (!token) return;
                const regId = Number(registration.id);
                const shippingSpec = {
                    fields: [
                        "*"
                    ],
                    filters: [
                        [
                            "parent_id",
                            "=",
                            regId
                        ],
                        [
                            "parent_type",
                            "=",
                            "customer_register"
                        ]
                    ]
                };
                const shippingPromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_REGISTER_ADDRESS, shippingSpec), {
                    method: "GET",
                    cache: "no-store"
                }, token).then((res)=>res.json().catch(()=>null));
                const existingGpPromise = registration.gp_id ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_PARENT, {
                    fields: [
                        "*"
                    ],
                    filters: [
                        [
                            "id",
                            "=",
                            registration.gp_id
                        ]
                    ],
                    limit: 1
                }), {
                    method: "GET",
                    cache: "no-store"
                }, token).then((res)=>res.json().catch(()=>null)) : Promise.resolve(null);
                const [shippingJson, gpJson] = await Promise.all([
                    shippingPromise,
                    existingGpPromise,
                    ensureNationalBrands()
                ]);
                if (!cancelled) {
                    setShippingAddresses(Array.isArray(shippingJson?.data) ? shippingJson.data : []);
                }
                if (registration.gp_id) {
                    const gpRow = Array.isArray(gpJson?.data) ? gpJson.data[0] : null;
                    if (!cancelled && gpRow) setExistingGp(gpRow);
                } else if (!cancelled) {
                    setExistingGp(null);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Gagal mempersiapkan data approval");
                }
            } finally{
                if (!cancelled) setIsPreparing(false);
            }
        }
        loadPreparationData();
        return ()=>{
            cancelled = true;
        };
    }, [
        demoGroupParents,
        demoMode,
        demoNationalBrands,
        ensureNationalBrands,
        existingNbid,
        isOpen,
        registration,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen || isPreparing || step !== 2) return;
        void ensureGroupParents();
    }, [
        ensureGroupParents,
        isOpen,
        isPreparing,
        step
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen || isPreparing) return;
        if (step !== 3 || !canSearchExistingGc || !effectiveGpid) {
            if (step !== 3) setGroupCustomers([]);
            return;
        }
        void ensureGroupCustomers(effectiveGpid);
    }, [
        canSearchExistingGc,
        effectiveGpid,
        ensureGroupCustomers,
        isOpen,
        isPreparing,
        step
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen || isPreparing) return;
        if (step !== 4 || !canSearchExistingBc || !effectiveGcid) {
            if (step !== 4) setBranchCustomers([]);
            return;
        }
        void ensureBranchCustomers(effectiveGcid);
    }, [
        canSearchExistingBc,
        effectiveGcid,
        ensureBranchCustomers,
        isOpen,
        isPreparing,
        step
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen) return;
        setShowCloseConfirm(false);
    }, [
        isOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!selectedGpid) return;
        const selectedGc = groupCustomers.find((row)=>Number(row.id) === Number(selectedGcid));
        if (selectedGc && Number(selectedGc.gpid || 0) !== Number(selectedGpid)) {
            setSelectedGcid(null);
        }
    }, [
        selectedGpid,
        selectedGcid,
        groupCustomers
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!selectedBcid) return;
        const effectiveGcid = selectedGcid || existingGcid;
        const selectedBc = branchCustomers.find((row)=>Number(row.id) === Number(selectedBcid));
        if (selectedBc && effectiveGcid && Number(selectedBc.gcid || 0) !== Number(effectiveGcid)) {
            setSelectedBcid(null);
        }
    }, [
        selectedBcid,
        selectedGcid,
        existingGcid,
        branchCustomers
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (step !== 3 || existingGcid) return;
        if (!selectedGcid && canSearchExistingGc) {
            setGcMode("search");
            return;
        }
        if (!canSearchExistingGc) {
            setGcMode("create");
            setSelectedGcid(null);
        }
    }, [
        step,
        existingGcid,
        canSearchExistingGc,
        selectedGcid
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (step !== 4 || existingBcid) return;
        if (!canSearchExistingBc) {
            setBcMode("create");
            setSelectedBcid(null);
            setBcSearch("");
        }
    }, [
        step,
        existingBcid,
        canSearchExistingBc
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isCreatingNewGpFlow) return;
        if (step >= 3 && !existingGcid && !selectedGcid) {
            setGcMode("create");
        }
        if (step >= 4 && !existingBcid && !selectedBcid) {
            setBcMode("create");
        }
    }, [
        isCreatingNewGpFlow,
        step,
        existingGcid,
        selectedGcid,
        existingBcid,
        selectedBcid
    ]);
    const buildGroupCustomerPayload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((gpid)=>{
        if (!registration) return null;
        return {
            gc_name: normalizeEntityName(gcName),
            gpid,
            ...buildCreditPolicyPayload(registration),
            owner_full_name: registration.user.full_name,
            owner_phone: normalizePhone(registration.user.phone),
            owner_email: registration.user.email,
            owner_place_of_birth: registration.user.place_of_birth,
            owner_date_of_birth: normalizeDate(registration.user.date_of_birth),
            company_type: registration.company.company_type,
            company_title: registration.company.company_title,
            company_name: registration.company.name
        };
    }, [
        gcName,
        registration
    ]);
    const buildCustomerRegisterApprovePayload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((ids, gpManualName, nbManualName)=>{
        const rawApplicantOwnerId = registration?.ekaplus_user?.id;
        const applicantOwnerId = typeof rawApplicantOwnerId === "number" ? rawApplicantOwnerId : Number.parseInt(String(rawApplicantOwnerId || ""), 10);
        const fallbackOwnerId = Number(registration?.created_by_id || 0);
        const shippingPayload = effectiveShippingAddresses.map((addr)=>({
                label: addr.label || "Warehouse",
                pic_name: addr.pic_name || undefined,
                pic_phone: normalizePhone(addr.pic_phone || undefined),
                address: addr.address || "",
                city: addr.city || "",
                district: addr.district || "",
                village: addr.village || "",
                // postal_code: addr.postal_code || "",
                province: addr.province || "",
                is_default: addr.is_default ? 1 : undefined
            }));
        return {
            status: "Syncing",
            docstatus: 1,
            owner: Number.isFinite(applicantOwnerId) && applicantOwnerId > 0 ? applicantOwnerId : fallbackOwnerId > 0 ? fallbackOwnerId : undefined,
            same_as_company_address: registration?.same_as_company_address ? 1 : 0,
            gpid: ids.gpid,
            gcid: ids.gcid,
            bcid: ids.bcid ?? null,
            nbid: ids.nbid ?? null,
            ...gpManualName ? {
                gp_manual: gpManualName
            } : {},
            ...nbManualName ? {
                nb_manual: nbManualName
            } : {},
            payment_method: registration?.support_data?.payment_method || undefined,
            payment_account: registration?.support_data?.payment_account || undefined,
            tax_status: registration?.company.tax_status ?? 0,
            npwp: registration?.company.tax_status === 1 ? registration?.company.npwp || undefined : undefined,
            erp_customer_group: registration?.support_data?.erp_customer_group || undefined,
            notes: registration?.support_data?.more_information || undefined,
            sales_team: registration?.support_data?.sales_team || undefined,
            customer_shipping_address: shippingPayload
        };
    }, [
        effectiveShippingAddresses,
        registration?.same_as_company_address,
        registration?.ekaplus_user?.id,
        registration?.created_by_id,
        registration?.support_data?.payment_method,
        registration?.support_data?.payment_account,
        registration?.company.tax_status,
        registration?.company.npwp,
        registration?.support_data?.erp_customer_group,
        registration?.support_data?.more_information,
        registration?.support_data?.sales_team
    ]);
    const validateCurrentStep = ()=>{
        // Step 1: National Brand (optional)
        if (step === 1) {
            if (createNationalBrand && !normalizeEntityName(nbName)) {
                return "Nama National Brand wajib diisi";
            }
        }
        // Step 2: Group Parent
        if (step === 2 && !existingGpid) {
            if (selectedGpid) return null;
            if (gpMode === "create") {
                if (!normalizeEntityName(gpName)) return "Nama Group Parent wajib diisi";
            } else if (gpMode === "idle" || gpMode === "search") {
                return "Pilih Group Parent yang ada atau klik 'Create New' untuk membuat baru";
            }
        }
        // Step 3: Group Customer
        if (step === 3 && !existingGcid) {
            if (canSearchExistingGc && selectedGcid) return null;
            if (gcMode === "create" || !canSearchExistingGc) {
                if (!normalizeEntityName(gcName)) return "GC Name wajib diisi";
            } else if (gcMode === "idle" || gcMode === "search") {
                return "Pilih Group Customer yang ada atau klik 'Create New' untuk membuat baru";
            }
        }
        // Step 4: Branch Customer
        if (step === 4 && !existingBcid) {
            return null;
        }
        return null;
    };
    const handleNextStep = async ()=>{
        if (demoMode) {
            setError(null);
            if (step === 1 && !effectiveNbid) {
                setSelectedNbid(demoNationalBrands[0]?.id || null);
            }
            if (step === 2 && !effectiveGpid) {
                const demoGp = demoGroupParents[0];
                if (demoGp) {
                    setSelectedGpid(demoGp.id);
                    setCreatedGpid(null);
                    setGpMode("search");
                }
            }
            if (step === 3 && !effectiveGcid) {
                const demoGc = demoGroupCustomers[0];
                if (demoGc) {
                    setSelectedGcid(demoGc.id);
                    setCreatedGcid(null);
                    setGcMode("search");
                }
            }
            if (step === 4 && !effectiveBcid) {
                const demoBc = demoBranchCustomers[0];
                if (demoBc) {
                    setSelectedBcid(demoBc.id);
                    setCreatedBc(demoBc);
                    setCreatedBcid(demoBc.id);
                    setBcMode("create");
                }
            }
            setStep((prev)=>Math.min(5, prev + 1));
            return;
        }
        const validationError = validateCurrentStep();
        if (validationError) {
            setError(validationError);
            return;
        }
        if (!registration || !token) {
            setError("Data tidak lengkap");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            if (step === 1) {
                if (createNationalBrand && !effectiveNbid) {
                    const nbJson = await apiJsonRequest("creating National Brand", (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.NATIONAL_BRAND), "POST", {
                        nb_name: normalizeEntityName(nbName),
                        ...buildCreditPolicyPayload(registration)
                    });
                    const newNbid = extractIdFromResourceResponse(nbJson);
                    if (!newNbid) throw new Error("Failed creating National Brand (missing id)");
                    setCreatedNbid(newNbid);
                    setSelectedNbid(newNbid);
                    setNbCreatedViaCreateFlow(true);
                    if (nbJson && typeof nbJson === "object" && "data" in nbJson && nbJson.data && typeof nbJson.data === "object") {
                        const row = nbJson.data;
                        setCreatedNb({
                            id: newNbid,
                            name: row.name,
                            nb_name: row.nb_name
                        });
                    }
                    setCreateNationalBrand(false);
                }
            } else if (step === 2) {
                if (!effectiveGpid) {
                    const gpPayload = {
                        gp_name: normalizeEntityName(gpName),
                        ...effectiveNbid ? {
                            nbid: effectiveNbid
                        } : {},
                        ...buildCreditPolicyPayload(registration)
                    };
                    const gpJson = await apiJsonRequest("creating Group Parent", (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_PARENT), "POST", gpPayload);
                    const newGpid = extractIdFromResourceResponse(gpJson);
                    if (!newGpid) throw new Error("Failed creating Group Parent (missing id)");
                    setCreatedGpid(newGpid);
                    setSelectedGpid(newGpid);
                    setGpCreatedViaCreateFlow(true);
                    if (gpJson && typeof gpJson === "object" && "data" in gpJson && gpJson.data && typeof gpJson.data === "object") {
                        const row = gpJson.data;
                        setCreatedGp({
                            id: newGpid,
                            name: row.name,
                            gp_name: row.gp_name,
                            nbid: row.nbid
                        });
                    }
                }
            } else if (step === 3) {
                if (!effectiveGcid) {
                    if (!effectiveGpid) {
                        throw new Error("GP belum tersedia. Selesaikan step Group Parent terlebih dahulu.");
                    }
                    const gcPayload = buildGroupCustomerPayload(effectiveGpid);
                    if (!gcPayload) throw new Error("Payload Group Customer tidak valid");
                    const gcJson = await apiJsonRequest("creating Group Customer", (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_CUSTOMER), "POST", gcPayload);
                    const newGcid = extractIdFromResourceResponse(gcJson);
                    if (!newGcid) throw new Error("Failed creating Group Customer (missing id)");
                    setCreatedGcid(newGcid);
                    setSelectedGcid(newGcid);
                    if (gcJson && typeof gcJson === "object" && "data" in gcJson && gcJson.data && typeof gcJson.data === "object") {
                        const row = gcJson.data;
                        setCreatedGc({
                            id: newGcid,
                            name: row.name,
                            gc_name: row.gc_name,
                            gpid: row.gpid
                        });
                    }
                }
            } else if (step === 4) {
                if (!effectiveGcid) {
                    throw new Error("GC belum tersedia. Selesaikan step Group Customer terlebih dahulu.");
                }
            // BC will be created/resolved on final commit (Step 5).
            }
            setStep((prev)=>Math.min(5, prev + 1));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memproses step");
        } finally{
            setIsSubmitting(false);
        }
    };
    const handleSubmitApproval = async ()=>{
        if (demoMode && registration) {
            setIsSubmitting(true);
            setError(null);
            window.setTimeout(()=>{
                setIsSubmitting(false);
                onSuccess(`Registrasi "${registration.company.name}" berhasil diproses ke Syncing.\n\nGROUP PARENT: GP9201\nGROUP CUSTOMER: GC9301\nBRANCH CUSTOMER: BC9401\nNATIONAL BRAND: NB9101`);
            }, 450);
            return;
        }
        if (!registration || !token) {
            setError("Data tidak lengkap");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const nbid = effectiveNbid;
            const gpid = effectiveGpid;
            const gcid = effectiveGcid;
            const bcid = effectiveBcid;
            if (!gpid || !gcid) {
                throw new Error("Relasi GP/GC belum lengkap. Pastikan step sebelumnya sudah selesai.");
            }
            const finalResult = {
                nbid,
                gpid,
                gcid,
                bcid
            };
            const updatePayload = buildCustomerRegisterApprovePayload(finalResult, gpCreatedViaCreateFlow ? normalizeEntityName(gpName) : undefined, nbCreatedViaCreateFlow ? normalizeEntityName(nbName) : undefined);
            await apiJsonRequest("updating customer_register approved", (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_REGISTER}/${registration.id}`, {
                fields: [
                    "*"
                ]
            }), "PUT", updatePayload);
            window.dispatchEvent(new Event("ekatalog:customer_registrations_update"));
            window.dispatchEvent(new Event("ekatalog:gp_update"));
            window.dispatchEvent(new Event("ekatalog:gc_update"));
            window.dispatchEvent(new Event("ekatalog:bc_update"));
            const gpCode = createdGp?.name || groupParents.find((row)=>Number(row.id) === Number(gpid))?.name || `GP${gpid}`;
            const gcCode = createdGc?.name || groupCustomers.find((row)=>Number(row.id) === Number(gcid))?.name || `GC${gcid}`;
            const bcCode = createdBc?.name || branchCustomers.find((row)=>Number(row.id) === Number(bcid))?.name || previewBcName;
            const nbCode = (nbid ? createdNb?.name || nationalBrands.find((row)=>Number(row.id) === Number(nbid))?.name : null) || undefined;
            onSuccess(`Registrasi "${registration.company.name}" berhasil diproses ke Syncing.\n\nGROUP PARENT: ${gpCode}\nGROUP CUSTOMER: ${gcCode}\nBRANCH CUSTOMER: ${bcCode}${nbCode ? `\nNATIONAL BRAND: ${nbCode}` : ""}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal approve registrasi");
        } finally{
            setIsSubmitting(false);
        }
    };
    if (!registration) return null;
    const gpDisplay = createdGp || existingGp;
    const selectedNbRow = nationalBrands.find((nb)=>Number(nb.id) === Number(selectedNbid));
    const nbDisplayRow = selectedNbRow || createdNb;
    const selectedGpRow = groupParents.find((gp)=>Number(gp.id) === Number(selectedGpid));
    const gpResolvedRow = selectedGpRow || gpDisplay;
    const selectedGcRow = groupCustomers.find((gc)=>Number(gc.id) === Number(selectedGcid));
    const gcDisplayRow = selectedGcRow || createdGc;
    const selectedBcRow = branchCustomers.find((bc)=>Number(bc.id) === Number(selectedBcid));
    const bcDisplayRow = selectedBcRow || createdBc;
    const previewGcName = (selectedGcRow?.gc_name || registration.gc_name || gcName || registration.company.name || "-").trim();
    const previewBcCity = registration.company.branch_city || registration.address.city_name || "-";
    const previewBcName = `${normalizeEntityName(previewGcName)} - ${previewBcCity}`;
    const historyNbName = nbDisplayRow?.nb_name || registration.master_links?.nb_name || registration.master_links?.nb_manual || (nbCreatedViaCreateFlow ? normalizeEntityName(nbName) : "") || "-";
    const historyNbCode = nbDisplayRow?.name || (effectiveNbid ? `NB${effectiveNbid}` : "-");
    const historyGpName = gpResolvedRow?.gp_name || registration.gp_name || registration.master_links?.gp_manual || (gpCreatedViaCreateFlow ? normalizeEntityName(gpName) : "") || "-";
    const historyGpCode = gpResolvedRow?.name || (effectiveGpid ? `GP${effectiveGpid}` : "-");
    const historyGcName = gcDisplayRow?.gc_name || registration.gc_name || (effectiveGcid ? normalizeEntityName(gcName) : "") || "-";
    const historyGcCode = gcDisplayRow?.name || (effectiveGcid ? `GC${effectiveGcid}` : "-");
    const historyBcName = bcDisplayRow?.bcid_name || registration.bc_name || previewBcName || "-";
    const historyBcCode = bcDisplayRow?.name || (effectiveBcid ? `BC${effectiveBcid}` : "AUTO");
    const renderProcessHistory = ({ showNb, showGp, showGc, showBc })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs font-bold text-blue-700 uppercase tracking-wide",
                    children: "Histori Proses"
                }, void 0, false, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 1409,
                    columnNumber: 7
                }, this),
                showNb && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg bg-white border border-gray-200 px-3 py-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs font-semibold text-gray-500",
                            children: "NB Name"
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1414,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-medium text-gray-900",
                            children: historyNbName
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1415,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-gray-500 mt-0.5",
                            children: [
                                "NBID: ",
                                historyNbCode
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1418,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 1413,
                    columnNumber: 9
                }, this),
                showGp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg bg-white border border-gray-200 px-3 py-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs font-semibold text-gray-500",
                            children: "GP Name"
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1425,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-medium text-gray-900",
                            children: historyGpName
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1426,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-gray-500 mt-0.5",
                            children: [
                                "GPID: ",
                                historyGpCode
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1429,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 1424,
                    columnNumber: 9
                }, this),
                showGc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg bg-white border border-gray-200 px-3 py-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs font-semibold text-gray-500",
                            children: "GC Name"
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1436,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-medium text-gray-900",
                            children: historyGcName
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1437,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-gray-500 mt-0.5",
                            children: [
                                "GCID: ",
                                historyGcCode
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1440,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 1435,
                    columnNumber: 9
                }, this),
                showBc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg bg-white border border-gray-200 px-3 py-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs font-semibold text-gray-500",
                            children: "BC Name"
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1447,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-medium text-gray-900",
                            children: historyBcName
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1448,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-gray-500 mt-0.5",
                            children: [
                                "BCID: ",
                                historyBcCode
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1451,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 1446,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
            lineNumber: 1408,
            columnNumber: 5
        }, this);
    const getBranchNameFromBc = (row)=>{
        if (!row) return "-";
        if (row.branch && typeof row.branch === "object" && "branch_name" in row.branch && typeof row.branch.branch_name === "string") {
            return row.branch.branch_name;
        }
        return row["branch.branch_name"] || "-";
    };
    const getBcPreviewLabel = (row)=>{
        if (!row) return "-";
        return `${row.bcid_name || row.name || `BC${row.id}`} - ${getBranchNameFromBc(row)}`;
    };
    // ---- Helpers for rendering selected state badge ----
    const renderSelectedGpBadge = ()=>{
        if (!selectedGpid) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-tour": "approve-registration-gp-selected-badge",
            className: "flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-blue-800 font-medium",
                    children: [
                        selectedGpRow?.gp_name || "-",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-blue-500",
                            children: [
                                "(",
                                selectedGpRow?.name || `GP${selectedGpid}`,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1487,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 1485,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    "data-tour": "approve-registration-gp-change-button",
                    type: "button",
                    className: "text-xs text-red-500 hover:underline ml-2",
                    onClick: ()=>{
                        setSelectedGpid(null);
                        setCreatedGpid(null);
                        setGpCreatedViaCreateFlow(false);
                        setSelectedGcid(null);
                        setCreatedGcid(null);
                        setSelectedBcid(null);
                        setCreatedBcid(null);
                        setGcMode("idle");
                        setBcMode("idle");
                        setGpMode("search");
                        setGpSearch("");
                    },
                    children: "Ganti"
                }, void 0, false, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 1491,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
            lineNumber: 1481,
            columnNumber: 7
        }, this);
    };
    const renderSelectedGcBadge = ()=>{
        if (!selectedGcid) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-blue-800 font-medium",
                    children: [
                        selectedGcRow?.gc_name || "-",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-blue-500",
                            children: [
                                "(",
                                selectedGcRow?.name || `GC${selectedGcid}`,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1521,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 1519,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: "text-xs text-red-500 hover:underline ml-2",
                    onClick: ()=>{
                        setSelectedGcid(null);
                        setCreatedGcid(null);
                        setSelectedBcid(null);
                        setCreatedBcid(null);
                        setBcMode("idle");
                        setGcMode("idle");
                        setGcSearch("");
                    },
                    children: "Ganti"
                }, void 0, false, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 1525,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
            lineNumber: 1518,
            columnNumber: 7
        }, this);
    };
    const renderSelectedBcBadge = ()=>{
        if (!selectedBcid) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-blue-50 border border-blue-200 rounded-xl px-3 py-3 text-sm space-y-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-blue-800 font-medium",
                            children: getBcPreviewLabel(selectedBcRow)
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1549,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "text-xs text-red-500 hover:underline ml-2",
                            onClick: ()=>{
                                setSelectedBcid(null);
                                setCreatedBcid(null);
                                setBcMode("idle");
                                setBcSearch("");
                            },
                            children: "Ganti"
                        }, void 0, false, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1552,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 1548,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-xs text-blue-700",
                    children: [
                        "PIC Branch: ",
                        selectedBcRow?.branch_owner || "-",
                        " (",
                        selectedBcRow?.branch_owner_phone || "-",
                        ")"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 1565,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
            lineNumber: 1547,
            columnNumber: 7
        }, this);
    };
    const handleModalKeyDown = (e)=>{
        if (e.key !== "Enter" || e.shiftKey) return;
        if (isSubmitting || isPreparing) return;
        const target = e.target;
        const tag = target?.tagName?.toLowerCase() || "";
        if (tag === "textarea" || tag === "button") return;
        e.preventDefault();
        e.stopPropagation();
        if (step < 5) {
            void handleNextStep();
            return;
        }
        void handleSubmitApproval();
    };
    const requestCloseModal = ()=>{
        if (isSubmitting) return;
        setShowCloseConfirm(true);
    };
    const handleConfirmClose = ()=>{
        setShowCloseConfirm(false);
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
            onMouseDown: (e)=>{
                if (e.target !== e.currentTarget) return;
                requestCloseModal();
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    "data-tour": demoMode ? "approve-registration-modal" : undefined,
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
                    onKeyDown: handleModalKeyDown,
                    tabIndex: -1,
                    className: "bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gradient-to-r from-green-500 to-green-600 px-6 py-5 flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaCheckCircle"], {
                                    className: "w-7 h-7 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 1620,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-bold text-white",
                                            children: "Approve Registrasi Customer"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 1622,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-green-100 mt-0.5",
                                            children: [
                                                "Step ",
                                                step,
                                                ": ",
                                                step === 1 && "National Brand",
                                                step === 2 && "Group Parent",
                                                step === 3 && "Group Customer",
                                                step === 4 && "Branch Customer",
                                                step === 5 && "Finalize Approve"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 1625,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 1621,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1619,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto p-6 space-y-6",
                            children: [
                                demoMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    "data-tour": "approve-registration-demo-banner",
                                    className: "rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
                                    children: "Mode tour aktif. Semua data di dialog ini adalah dummy dan tidak akan mengubah data customer asli."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 1637,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1",
                                            children: "Registrasi Customer"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 1646,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-lg font-bold text-blue-900",
                                            children: registration.company.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 1649,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-4 mt-2 text-sm text-blue-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaBuilding"], {
                                                            className: "w-3.5 h-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1654,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: registration.company.business_type
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1655,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1653,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {
                                                            className: "w-3.5 h-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1658,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: registration.company.branch_name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1659,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1657,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 1652,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 1645,
                                    columnNumber: 15
                                }, this),
                                isPreparing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-600",
                                    children: "Menyiapkan data approval..."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 1665,
                                    columnNumber: 17
                                }, this),
                                !isPreparing && step === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    "data-tour": "approve-registration-step-1",
                                    className: "grid grid-cols-1 md:grid-cols-12 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                            className: "md:col-span-4 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-bold text-blue-700 uppercase tracking-wide",
                                                    children: "Registration Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1677,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-gray-900",
                                                    children: registration.company.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1680,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-gray-700 space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaBuilding"], {
                                                                    className: "text-gray-700"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1685,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col items-start",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs font-semibold text-gray-500",
                                                                            children: "Business Type"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1687,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "font-medium text-black",
                                                                            children: registration.company.business_type
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1690,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1686,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1684,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {
                                                                    className: "text-gray-700"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1696,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col items-start",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs font-semibold text-gray-500",
                                                                            children: "Location"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1698,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "font-medium text-black",
                                                                            children: registration.company.branch_name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1701,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1697,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1695,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUser"], {
                                                                    className: "text-gray-700"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1707,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col items-start",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs font-semibold text-gray-500",
                                                                            children: "Contact Person"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1709,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-col font-medium text-black",
                                                                            children: [
                                                                                registration.user.full_name,
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-blue-600",
                                                                                    children: registration.user.phone
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 1714,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1712,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1708,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1706,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1683,
                                                    columnNumber: 21
                                                }, this),
                                                renderProcessHistory({
                                                    showNb: true,
                                                    showGp: false,
                                                    showGc: false,
                                                    showBc: false
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 1676,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:col-span-8 rounded-xl border border-gray-200 bg-white p-4 space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-base font-bold text-gray-900",
                                                    children: "National Brand (Optional)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1729,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Step ini opsional. Anda bisa lanjut tanpa membuat National Brand."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1732,
                                                    columnNumber: 21
                                                }, this),
                                                existingNbid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-900",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold",
                                                            children: "National Brand sudah terpasang di registrasi."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1738,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1",
                                                            children: [
                                                                "NB ID: ",
                                                                existingNbid
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1741,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1737,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "relative",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSearch"], {
                                                                            className: "absolute left-3 top-3.5 text-gray-400 text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1747,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            value: nbSearch,
                                                                            onChange: (e)=>setNbSearch(e.target.value),
                                                                            className: "w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400",
                                                                            placeholder: "Cari National Brand (nama / kode)..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1748,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1746,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-xl border border-gray-200 overflow-hidden",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "px-3 py-2 text-xs font-bold text-gray-500 bg-gray-50 border-b",
                                                                            children: nbSearch.trim() ? "HASIL PENCARIAN NATIONAL BRAND" : "DAFTAR NATIONAL BRAND"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1756,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        filteredNationalBrands.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "max-h-56 overflow-y-auto divide-y divide-gray-100",
                                                                            children: filteredNationalBrands.map((nb)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 cursor-pointer",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-gray-800",
                                                                                            children: [
                                                                                                nb.nb_name || "-",
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: [
                                                                                                        "(NBID: ",
                                                                                                        nb.name || `NB${nb.id}`,
                                                                                                        ")"
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                                    lineNumber: 1770,
                                                                                                    columnNumber: 39
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 1768,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "radio",
                                                                                            name: "select-nb",
                                                                                            checked: Number(selectedNbid) === Number(nb.id),
                                                                                            onClick: (e)=>{
                                                                                                if (Number(selectedNbid) === Number(nb.id)) {
                                                                                                    e.preventDefault();
                                                                                                    setSelectedNbid(null);
                                                                                                }
                                                                                            },
                                                                                            onChange: ()=>{
                                                                                                setSelectedNbid(nb.id);
                                                                                                setCreatedNbid(null);
                                                                                                setCreatedNb(null);
                                                                                                setNbCreatedViaCreateFlow(false);
                                                                                                setCreateNationalBrand(false);
                                                                                            }
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 1774,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, nb.id, true, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 1764,
                                                                                    columnNumber: 35
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1762,
                                                                            columnNumber: 31
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "px-3 py-3 text-xs text-gray-500",
                                                                            children: "National Brand tidak ditemukan."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1800,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1755,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1745,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: createNationalBrand,
                                                                            onChange: (e)=>{
                                                                                setCreateNationalBrand(e.target.checked);
                                                                                if (e.target.checked) {
                                                                                    setSelectedNbid(null);
                                                                                    setCreatedNbid(null);
                                                                                    setCreatedNb(null);
                                                                                    setNbCreatedViaCreateFlow(false);
                                                                                    if (!nbName.trim() && nbSearch.trim()) {
                                                                                        setNbName(normalizeEntityName(nbSearch));
                                                                                    }
                                                                                } else {
                                                                                    setNbCreatedViaCreateFlow(false);
                                                                                }
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1808,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm",
                                                                            children: "Buat National Brand baru"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1826,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1807,
                                                                    columnNumber: 27
                                                                }, this),
                                                                !createNationalBrand && selectedNbid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>{
                                                                        setSelectedNbid(null);
                                                                        setCreatedNbid(null);
                                                                        setCreatedNb(null);
                                                                        setNbCreatedViaCreateFlow(false);
                                                                    },
                                                                    className: "text-xs font-medium text-gray-600 hover:text-red-600 hover:underline",
                                                                    children: "Hapus pilihan NB"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1831,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1806,
                                                            columnNumber: 25
                                                        }, this),
                                                        createNationalBrand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: [
                                                                        "National Brand Name",
                                                                        " ",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-red-500",
                                                                            children: "*"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1849,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1847,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    value: nbName,
                                                                    onChange: (e)=>setNbName(toUpperInput(e.target.value)),
                                                                    onBlur: ()=>setNbName((prev)=>normalizeEntityName(prev)),
                                                                    className: "w-full px-4 py-2.5 border border-gray-300 rounded-xl",
                                                                    placeholder: "Contoh: EKATUNGGAL"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1851,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1846,
                                                            columnNumber: 27
                                                        }, this),
                                                        !createNationalBrand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600",
                                                            children: [
                                                                "Anda bisa pilih NB existing dari list, atau klik",
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold",
                                                                    children: "Next"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1867,
                                                                    columnNumber: 29
                                                                }, this),
                                                                " untuk lanjut tanpa NB."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1865,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 1728,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 1672,
                                    columnNumber: 17
                                }, this),
                                !isPreparing && step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    "data-tour": "approve-registration-step-2",
                                    className: "grid grid-cols-1 md:grid-cols-12 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                            className: "md:col-span-4 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-bold text-blue-700 uppercase tracking-wide",
                                                    children: "Registration Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1884,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-gray-900",
                                                    children: registration.company.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1887,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-gray-700 space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaBuilding"], {
                                                                    className: "text-gray-700"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1892,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col items-start",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs font-semibold text-gray-500",
                                                                            children: "Business Type"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1894,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "font-medium text-black",
                                                                            children: registration.company.business_type
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1897,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1893,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1891,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {
                                                                    className: "text-gray-700"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1903,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col items-start",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs font-semibold text-gray-500",
                                                                            children: "Location"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1905,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "font-medium text-black",
                                                                            children: registration.company.branch_name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1908,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1904,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1902,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUser"], {
                                                                    className: "text-gray-700"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1914,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col items-start",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs font-semibold text-gray-500",
                                                                            children: "Contact Person"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1916,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-col font-medium text-black",
                                                                            children: [
                                                                                registration.user.full_name,
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-blue-600",
                                                                                    children: registration.user.phone
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 1921,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1919,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1915,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1913,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1890,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 1883,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:col-span-8 rounded-xl border border-gray-200 bg-white p-4 space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-base font-bold text-gray-900",
                                                    children: "Select Group Parent"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1931,
                                                    columnNumber: 21
                                                }, this),
                                                existingGpid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-900",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold",
                                                            children: "Group Parent sudah ada, tidak bisa membuat baru."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1937,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1",
                                                            children: [
                                                                gpDisplay?.gp_name || registration.gp_name || "-",
                                                                " ",
                                                                "(GPID:",
                                                                " ",
                                                                gpDisplay?.name || registration.gp_name || `GP${existingGpid}`,
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1940,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 1936,
                                                    columnNumber: 23
                                                }, this) : selectedGpid ? // GP already selected — show badge only
                                                renderSelectedGpBadge() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        gpMode !== "create" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: [
                                                                isGpLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700",
                                                                    children: "Memuat referensi Group Parent..."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1960,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "relative flex-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSearch"], {
                                                                                    className: "absolute left-3 top-3.5 text-gray-400 text-sm"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 1966,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    "data-tour": "approve-registration-gp-search-input",
                                                                                    autoFocus: true,
                                                                                    value: gpSearch,
                                                                                    onChange: (e)=>setGpSearch(e.target.value),
                                                                                    className: "w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400",
                                                                                    placeholder: "Ketik nama GP atau kode..."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 1967,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1965,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>{
                                                                                setGpMode("search");
                                                                                setGpSearch("");
                                                                            },
                                                                            className: "px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-all",
                                                                            children: "Batal"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1976,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1964,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-xl border border-gray-200 overflow-hidden",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "px-3 py-2 text-xs font-bold text-gray-500 bg-gray-50 border-b",
                                                                            children: gpSearch.trim() ? "HASIL PENCARIAN" : "DAFTAR GROUP PARENT"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1989,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        filteredGroupParents.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "max-h-56 overflow-y-auto divide-y divide-gray-100",
                                                                            children: filteredGroupParents.map((gp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    "data-tour": `approve-registration-gp-result-${gp.id}`,
                                                                                    type: "button",
                                                                                    className: "w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 text-left transition-colors",
                                                                                    onClick: ()=>{
                                                                                        setSelectedGpid(gp.id);
                                                                                        setCreatedGpid(null);
                                                                                        setGpCreatedViaCreateFlow(false);
                                                                                        setSelectedGcid(null);
                                                                                        setCreatedGcid(null);
                                                                                        setCreatedGc(null);
                                                                                        setSelectedBcid(null);
                                                                                        setCreatedBcid(null);
                                                                                        setCreatedBc(null);
                                                                                        setGcMode("idle");
                                                                                        setBcMode("idle");
                                                                                        setGpMode("search");
                                                                                        setGpSearch("");
                                                                                    },
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-gray-800",
                                                                                            children: [
                                                                                                gp.gp_name || "-",
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: [
                                                                                                        "(GPID: ",
                                                                                                        gp.name || `GP${gp.id}`,
                                                                                                        ")"
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                                    lineNumber: 2020,
                                                                                                    columnNumber: 41
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 2018,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs text-blue-600 font-medium",
                                                                                            children: "Pilih"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 2024,
                                                                                            columnNumber: 39
                                                                                        }, this)
                                                                                    ]
                                                                                }, gp.id, true, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 1997,
                                                                                    columnNumber: 37
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 1995,
                                                                            columnNumber: 33
                                                                        }, this) : gpSearch.trim() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "px-3 py-3 space-y-2.5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-gray-500",
                                                                                    children: [
                                                                                        'GP tidak ditemukan untuk "',
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "font-medium",
                                                                                            children: gpSearch
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 2034,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        '"'
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2032,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    "data-tour": "approve-registration-gp-create-trigger",
                                                                                    type: "button",
                                                                                    onClick: ()=>{
                                                                                        setGpName(normalizeEntityName(gpSearch));
                                                                                        setSelectedGpid(null);
                                                                                        setCreatedGpid(null);
                                                                                        setGpCreatedViaCreateFlow(false);
                                                                                        setSelectedGcid(null);
                                                                                        setCreatedGcid(null);
                                                                                        setCreatedGc(null);
                                                                                        setSelectedBcid(null);
                                                                                        setCreatedBcid(null);
                                                                                        setCreatedBc(null);
                                                                                        setGcMode("idle");
                                                                                        setBcMode("idle");
                                                                                        setGpMode("create");
                                                                                    },
                                                                                    className: "w-full py-2 rounded-xl border-2 border-green-300 text-green-700 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPlusCircle"], {
                                                                                            className: "w-4 h-4"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 2059,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        "Buat GP Baru"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2039,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2031,
                                                                            columnNumber: 33
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "px-3 py-3 text-xs text-gray-400",
                                                                            children: "Menampilkan 20 data GP terbaru."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2064,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 1988,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 1958,
                                                            columnNumber: 27
                                                        }, this),
                                                        gpMode === "create" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            "data-tour": "approve-registration-gp-create-panel",
                                                            className: "space-y-3 border-2 border-green-200 rounded-xl p-4 bg-green-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between mb-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-bold text-green-800",
                                                                            children: "Buat Group Parent Baru"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2079,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            "data-tour": "approve-registration-gp-create-cancel",
                                                                            type: "button",
                                                                            onClick: ()=>setGpMode("search"),
                                                                            className: "text-xs text-gray-500 hover:underline",
                                                                            children: "Batal"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2082,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2078,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                            children: [
                                                                                "Group Parent Name",
                                                                                " ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-red-500",
                                                                                    children: "*"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2094,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2092,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            "data-tour": "approve-registration-gp-create-input",
                                                                            value: gpName,
                                                                            onChange: (e)=>setGpName(toUpperInput(e.target.value)),
                                                                            onBlur: ()=>setGpName((prev)=>normalizeEntityName(prev)),
                                                                            className: "w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white",
                                                                            placeholder: "Contoh: EKATUNGGAL GP"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2096,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2091,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2074,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 1930,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 1879,
                                    columnNumber: 17
                                }, this),
                                !isPreparing && step === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    "data-tour": "approve-registration-step-3",
                                    className: "grid grid-cols-1 md:grid-cols-12 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                            className: "md:col-span-4 space-y-3",
                                            children: renderProcessHistory({
                                                showNb: true,
                                                showGp: true,
                                                showGc: false,
                                                showBc: false
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2123,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:col-span-8 rounded-xl border border-gray-200 bg-white p-4 space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-base font-bold text-gray-900",
                                                    children: "Select Group Customer"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2133,
                                                    columnNumber: 21
                                                }, this),
                                                existingGcid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-900",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold",
                                                            children: "Group Customer sudah ada."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2139,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1",
                                                            children: [
                                                                "GC ID: ",
                                                                existingGcid
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2142,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2138,
                                                    columnNumber: 23
                                                }, this) : selectedGcid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        renderSelectedGcBadge(),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-gray-50 rounded-xl border border-gray-200 p-4 text-sm space-y-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-semibold",
                                                                            children: "Owner:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2149,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        " ",
                                                                        registration.user.full_name
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2148,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-semibold",
                                                                            children: "Phone:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2153,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        " ",
                                                                        registration.user.phone
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2152,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-semibold",
                                                                            children: "Email:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2157,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        " ",
                                                                        registration.user.email
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2156,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-semibold",
                                                                            children: "Company:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2161,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        " ",
                                                                        registration.company.name
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2160,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2147,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        !canSearchExistingGc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800",
                                                            children: "Karena Group Parent akan dibuat baru, Group Customer harus dibuat baru (tidak bisa pilih existing)."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2169,
                                                            columnNumber: 27
                                                        }, this),
                                                        gcMode === "idle" && canSearchExistingGc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setGcMode("search"),
                                                            className: "w-full py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSearch"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2182,
                                                                    columnNumber: 29
                                                                }, this),
                                                                "Cari Group Customer yang Ada"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2177,
                                                            columnNumber: 27
                                                        }, this),
                                                        gcMode === "idle" && !canSearchExistingGc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setGcMode("create"),
                                                            className: "w-full py-2.5 rounded-xl border-2 border-green-300 text-green-700 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPlusCircle"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2193,
                                                                    columnNumber: 29
                                                                }, this),
                                                                "Buat Group Customer Baru"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2188,
                                                            columnNumber: 27
                                                        }, this),
                                                        gcMode === "search" && canSearchExistingGc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: [
                                                                isGcLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700",
                                                                    children: "Memuat referensi Group Customer..."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2202,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "relative flex-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSearch"], {
                                                                                    className: "absolute left-3 top-3.5 text-gray-400 text-sm"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2208,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    autoFocus: true,
                                                                                    value: gcSearch,
                                                                                    onChange: (e)=>setGcSearch(e.target.value),
                                                                                    className: "w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400",
                                                                                    placeholder: "Ketik nama GC atau kode..."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2209,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2207,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>{
                                                                                setGcMode("idle");
                                                                                setGcSearch("");
                                                                            },
                                                                            className: "px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-all",
                                                                            children: "Batal"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2217,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2206,
                                                                    columnNumber: 29
                                                                }, this),
                                                                !gcSearch.trim() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>{
                                                                        setGcName(normalizeEntityName(registration.company.name || ""));
                                                                        setSelectedGcid(null);
                                                                        setCreatedGcid(null);
                                                                        setSelectedBcid(null);
                                                                        setCreatedBcid(null);
                                                                        setBcMode("idle");
                                                                        setGcMode("create");
                                                                    },
                                                                    className: "w-full py-2.5 rounded-xl border-2 border-green-300 text-green-700 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPlusCircle"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2247,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        "Buat GC Baru"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2230,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-xl border border-gray-200 overflow-hidden",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "px-3 py-2 text-xs font-bold text-gray-500 bg-gray-50 border-b",
                                                                            children: gcSearch.trim() ? "HASIL PENCARIAN" : "DAFTAR GROUP CUSTOMER"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2253,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        filteredGroupCustomers.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "max-h-56 overflow-y-auto divide-y divide-gray-100",
                                                                            children: filteredGroupCustomers.map((gc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    className: "w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 text-left transition-colors",
                                                                                    onClick: ()=>{
                                                                                        setSelectedGcid(gc.id);
                                                                                        setCreatedGcid(null);
                                                                                        setSelectedBcid(null);
                                                                                        setCreatedBcid(null);
                                                                                        setCreatedBc(null);
                                                                                        setBcMode("idle");
                                                                                        setGcMode("idle");
                                                                                        setGcSearch("");
                                                                                    },
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-gray-800",
                                                                                            children: [
                                                                                                gc.gc_name || "-",
                                                                                                " ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-gray-500",
                                                                                                    children: [
                                                                                                        "(GCID: ",
                                                                                                        gc.name || `GC${gc.id}`,
                                                                                                        ")"
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                                    lineNumber: 2278,
                                                                                                    columnNumber: 41
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 2276,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs text-blue-600 font-medium",
                                                                                            children: "Pilih"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 2282,
                                                                                            columnNumber: 39
                                                                                        }, this)
                                                                                    ]
                                                                                }, gc.id, true, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2261,
                                                                                    columnNumber: 37
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2259,
                                                                            columnNumber: 33
                                                                        }, this) : gcSearch.trim() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "px-3 py-3 space-y-2.5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-gray-500",
                                                                                    children: [
                                                                                        'GC tidak ditemukan untuk "',
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "font-medium",
                                                                                            children: gcSearch
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 2292,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        '"'
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2290,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    onClick: ()=>{
                                                                                        setGcName(normalizeEntityName(registration.company.name || ""));
                                                                                        setSelectedGcid(null);
                                                                                        setCreatedGcid(null);
                                                                                        setSelectedBcid(null);
                                                                                        setCreatedBcid(null);
                                                                                        setBcMode("idle");
                                                                                        setGcMode("create");
                                                                                    },
                                                                                    className: "w-full py-2 rounded-xl border-2 border-green-300 text-green-700 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPlusCircle"], {
                                                                                            className: "w-4 h-4"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 2314,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        "Buat GC Baru"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2297,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2289,
                                                                            columnNumber: 33
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "px-3 py-3 text-xs text-gray-400",
                                                                            children: "Menampilkan 20 data GC terbaru."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2319,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2252,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2200,
                                                            columnNumber: 27
                                                        }, this),
                                                        gcMode === "create" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3 border-2 border-green-200 rounded-xl p-4 bg-green-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between mb-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-bold text-green-800",
                                                                            children: "Buat Group Customer Baru"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2331,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>setGcMode("idle"),
                                                                            className: "text-xs text-gray-500 hover:underline",
                                                                            children: "Batal"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2334,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2330,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                            children: [
                                                                                "GC Name (otomatis dari company)",
                                                                                " ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-red-500",
                                                                                    children: "*"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2345,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2343,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            value: gcName,
                                                                            readOnly: true,
                                                                            onBlur: ()=>setGcName((prev)=>normalizeEntityName(prev)),
                                                                            className: "w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-100 text-gray-800"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2347,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2342,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bg-white rounded-xl border border-gray-200 p-3 text-sm space-y-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold",
                                                                                    children: "Owner:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2358,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                " ",
                                                                                registration.user.full_name
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2357,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold",
                                                                                    children: "Phone:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2362,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                " ",
                                                                                registration.user.phone
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2361,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold",
                                                                                    children: "Email:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2366,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                " ",
                                                                                registration.user.email
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2365,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold",
                                                                                    children: "Company:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2370,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                " ",
                                                                                registration.company.name
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2369,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2356,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2329,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2132,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 2119,
                                    columnNumber: 17
                                }, this),
                                !isPreparing && step === 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    "data-tour": "approve-registration-step-4",
                                    className: "grid grid-cols-1 md:grid-cols-12 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                            className: "md:col-span-4 space-y-3",
                                            children: renderProcessHistory({
                                                showNb: true,
                                                showGp: true,
                                                showGc: true,
                                                showBc: false
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2388,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:col-span-8 rounded-xl border border-gray-200 bg-white p-4 space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-base font-bold text-gray-900",
                                                    children: "Select Branch Customer"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2398,
                                                    columnNumber: 21
                                                }, this),
                                                existingBcid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-900",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold",
                                                            children: "Branch Customer sudah ada."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2404,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1",
                                                            children: [
                                                                "BC ID: ",
                                                                existingBcid
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2407,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2403,
                                                    columnNumber: 23
                                                }, this) : selectedBcid ? renderSelectedBcBadge() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        !canSearchExistingBc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800",
                                                            children: "Karena Group Customer akan dibuat baru, Branch Customer harus dibuat baru (tidak bisa pilih existing)."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2414,
                                                            columnNumber: 27
                                                        }, this),
                                                        bcMode === "idle" && canSearchExistingBc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setBcMode("search"),
                                                            className: "w-full py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSearch"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2427,
                                                                    columnNumber: 29
                                                                }, this),
                                                                "Cari Branch Customer yang Ada"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2422,
                                                            columnNumber: 27
                                                        }, this),
                                                        bcMode === "idle" && !canSearchExistingBc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setBcMode("create"),
                                                            className: "w-full py-2.5 rounded-xl border-2 border-green-300 text-green-700 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPlusCircle"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2438,
                                                                    columnNumber: 29
                                                                }, this),
                                                                "Buat Branch Customer Baru"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2433,
                                                            columnNumber: 27
                                                        }, this),
                                                        bcMode === "search" && canSearchExistingBc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: [
                                                                isBcLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700",
                                                                    children: "Memuat referensi Branch Customer..."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2447,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "relative flex-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSearch"], {
                                                                                    className: "absolute left-3 top-3.5 text-gray-400 text-sm"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2453,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    autoFocus: true,
                                                                                    value: bcSearch,
                                                                                    onChange: (e)=>setBcSearch(e.target.value),
                                                                                    className: "w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400",
                                                                                    placeholder: "Ketik nama BC atau kode..."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2454,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2452,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>{
                                                                                setBcMode("idle");
                                                                                setBcSearch("");
                                                                            },
                                                                            className: "px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-all",
                                                                            children: "Batal"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2462,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2451,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-xl border border-gray-200 overflow-hidden",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "px-3 py-2 text-xs font-bold text-gray-500 bg-gray-50 border-b",
                                                                            children: bcSearch.trim() ? "HASIL PENCARIAN" : "DAFTAR BRANCH CUSTOMER"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2475,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        filteredBranchCustomers.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "max-h-56 overflow-y-auto divide-y divide-gray-100",
                                                                            children: filteredBranchCustomers.map((bc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    className: "w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 text-left transition-colors",
                                                                                    onClick: ()=>{
                                                                                        setSelectedBcid(bc.id);
                                                                                        setCreatedBcid(null);
                                                                                        setBcMode("idle");
                                                                                        setBcSearch("");
                                                                                    },
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "flex flex-col",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-sm text-gray-800",
                                                                                                    children: getBcPreviewLabel(bc)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                                    lineNumber: 2495,
                                                                                                    columnNumber: 41
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-xs text-gray-500",
                                                                                                    children: [
                                                                                                        "PIC: ",
                                                                                                        bc.branch_owner || "-",
                                                                                                        " (",
                                                                                                        bc.branch_owner_phone || "-",
                                                                                                        ")"
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                                    lineNumber: 2498,
                                                                                                    columnNumber: 41
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 2494,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs text-blue-600 font-medium",
                                                                                            children: "Pilih"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 2503,
                                                                                            columnNumber: 39
                                                                                        }, this)
                                                                                    ]
                                                                                }, bc.id, true, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2483,
                                                                                    columnNumber: 37
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2481,
                                                                            columnNumber: 33
                                                                        }, this) : bcSearch.trim() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "px-3 py-3 space-y-2.5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-gray-500",
                                                                                    children: [
                                                                                        'BC tidak ditemukan untuk "',
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "font-medium",
                                                                                            children: bcSearch
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 2513,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        '"'
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2511,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    onClick: ()=>setBcMode("create"),
                                                                                    className: "w-full py-2 rounded-xl border-2 border-green-300 text-green-700 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPlusCircle"], {
                                                                                            className: "w-4 h-4"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                            lineNumber: 2523,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        "Buat BC Baru"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2518,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2510,
                                                                            columnNumber: 33
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "px-3 py-3 text-xs text-gray-400",
                                                                            children: "Menampilkan 20 data BC terbaru."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2528,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2474,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2445,
                                                            columnNumber: 27
                                                        }, this),
                                                        bcMode === "create" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3 border-2 border-green-200 rounded-xl p-4 bg-green-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between mb-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-bold text-green-800",
                                                                            children: "Buat Branch Customer Baru"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2540,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>setBcMode("idle"),
                                                                            className: "text-xs text-gray-500 hover:underline",
                                                                            children: "Batal"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2543,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2539,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bg-white rounded-xl border border-gray-200 p-3 text-sm space-y-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "font-semibold text-gray-700 mb-1",
                                                                            children: "Data yang akan dibuat:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2552,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold",
                                                                                    children: "Preview:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2556,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                " ",
                                                                                previewBcName
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2555,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold",
                                                                                    children: "Branch:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2560,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                " ",
                                                                                registration.company.branch_id
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2559,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold",
                                                                                    children: "Product Need:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2564,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                " ",
                                                                                registration.company.product_need || "-"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2563,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold",
                                                                                    children: "Branch Owner:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2570,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                " ",
                                                                                registration.branch_owner?.full_name || registration.user.full_name
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2569,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold",
                                                                                    children: "No. Branch Owner:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2577,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                " ",
                                                                                registration.branch_owner?.phone || registration.user.phone
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2576,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold",
                                                                                    children: "Shipping Rows:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                                    lineNumber: 2584,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                " ",
                                                                                effectiveShippingAddresses.length
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                            lineNumber: 2583,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                                    lineNumber: 2551,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2538,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2397,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 2384,
                                    columnNumber: 17
                                }, this),
                                !isPreparing && step === 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    "data-tour": "approve-registration-step-5",
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-green-50 border border-green-200 rounded-xl p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-semibold text-green-800",
                                                    children: "Semua resource sudah diproses."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2604,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-green-700 mt-1",
                                                    children: [
                                                        "Klik ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold",
                                                            children: "Commit Approve"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2608,
                                                            columnNumber: 28
                                                        }, this),
                                                        " ",
                                                        "untuk update status customer register menjadi Syncing."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2607,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2603,
                                            columnNumber: 19
                                        }, this),
                                        renderProcessHistory({
                                            showNb: true,
                                            showGp: true,
                                            showGc: true,
                                            showBc: true
                                        }),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gray-50 rounded-xl border border-gray-200 p-4 text-sm space-y-1",
                                            children: [
                                                nbCreatedViaCreateFlow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold",
                                                            children: "NB Manual:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2621,
                                                            columnNumber: 25
                                                        }, this),
                                                        " ",
                                                        normalizeEntityName(nbName)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2620,
                                                    columnNumber: 23
                                                }, this),
                                                gpCreatedViaCreateFlow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold",
                                                            children: "GP Manual:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2627,
                                                            columnNumber: 25
                                                        }, this),
                                                        " ",
                                                        normalizeEntityName(gpName)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2626,
                                                    columnNumber: 23
                                                }, this),
                                                createdGcid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold",
                                                            children: "GC Manual:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2633,
                                                            columnNumber: 25
                                                        }, this),
                                                        " ",
                                                        normalizeEntityName(gcName)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2632,
                                                    columnNumber: 23
                                                }, this),
                                                (createdNbid || createdGpid || createdBcid) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 pt-1",
                                                    children: [
                                                        "Ref IDs:",
                                                        createdNbid ? ` NB:${createdNbid}` : "",
                                                        createdGpid ? ` GP:${createdGpid}` : "",
                                                        createdBcid ? ` BC:${createdBcid}` : ""
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2638,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2618,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 2599,
                                    columnNumber: 17
                                }, this),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaExclamationTriangle"], {
                                            className: "w-4 h-4 text-red-600 flex-shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2651,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-red-700 font-medium",
                                            children: error
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2652,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 2650,
                                    columnNumber: 17
                                }, this),
                                operationLogs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-50 border border-gray-200 rounded-xl p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaListUl"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2659,
                                                    columnNumber: 21
                                                }, this),
                                                "Operation Log"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2658,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 max-h-48 overflow-y-auto",
                                            children: operationLogs.map((log, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `font-semibold ${log.status === "failed" ? "text-red-600" : log.status === "success" ? "text-green-600" : "text-blue-600"}`,
                                                            children: [
                                                                "[",
                                                                log.status.toUpperCase(),
                                                                "]"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2665,
                                                            columnNumber: 25
                                                        }, this),
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-700",
                                                            children: log.stage
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2676,
                                                            columnNumber: 25
                                                        }, this),
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-500",
                                                            children: log.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                            lineNumber: 2677,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, `${log.stage}-${idx}`, true, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2664,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2662,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 2657,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 1635,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-50 px-6 py-4 flex justify-between gap-3 border-t border-gray-200",
                            children: [
                                step > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-tour": "approve-registration-prev-button",
                                    onClick: ()=>setStep((prev)=>Math.max(1, prev - 1)),
                                    disabled: isSubmitting,
                                    className: "px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaArrowLeft"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2695,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Kembali"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2696,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 2687,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: requestCloseModal,
                                    disabled: isSubmitting,
                                    className: "px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: "Batal"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 2699,
                                    columnNumber: 17
                                }, this),
                                step < 5 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                                    "data-tour": "approve-registration-next-button",
                                    whileHover: !isSubmitting ? {
                                        scale: 1.02
                                    } : {},
                                    whileTap: !isSubmitting ? {
                                        scale: 0.98
                                    } : {},
                                    onClick: ()=>void handleNextStep(),
                                    disabled: isSubmitting || isPreparing,
                                    className: "px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: "Next"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 2709,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                                    "data-tour": "approve-registration-commit-button",
                                    whileHover: !isSubmitting ? {
                                        scale: 1.02
                                    } : {},
                                    whileTap: !isSubmitting ? {
                                        scale: 0.98
                                    } : {},
                                    onClick: handleSubmitApproval,
                                    disabled: isSubmitting || isPreparing,
                                    className: "px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                                    children: isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                lineNumber: 2730,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Memproses..."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                lineNumber: 2731,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaCheckCircle"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                lineNumber: 2735,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Commit Approve"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                lineNumber: 2736,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 2720,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 2685,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 1610,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    children: showCloseConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        exit: {
                            opacity: 0
                        },
                        className: "absolute inset-0 z-10 flex items-center justify-center bg-black/30 p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                scale: 0.96,
                                y: 8
                            },
                            animate: {
                                opacity: 1,
                                scale: 1,
                                y: 0
                            },
                            exit: {
                                opacity: 0,
                                scale: 0.96,
                                y: 8
                            },
                            className: "w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaExclamationTriangle"], {
                                            className: "mt-0.5 h-6 w-6 text-amber-500"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2759,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-bold text-gray-900",
                                                    children: "Tutup dialog approval?"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2761,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Progress yang belum disubmit akan ditutup. Yakin ingin keluar dari dialog ini?"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                                    lineNumber: 2764,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2760,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 2758,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 flex justify-end gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setShowCloseConfirm(false),
                                            className: "px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all",
                                            children: "Tidak"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2772,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: handleConfirmClose,
                                            className: "px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all",
                                            children: "Ya, Tutup"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                            lineNumber: 2779,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                                    lineNumber: 2771,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                            lineNumber: 2752,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                        lineNumber: 2746,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
                    lineNumber: 2744,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
            lineNumber: 1603,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/customers/registration/ApproveRegistrationModal.tsx",
        lineNumber: 1601,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_customers_registration_ApproveRegistrationModal_tsx_85964526._.js.map