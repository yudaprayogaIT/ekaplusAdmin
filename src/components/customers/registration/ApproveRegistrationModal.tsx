"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaArrowLeft,
  FaBuilding,
  FaMapMarkerAlt,
  FaListUl,
} from "react-icons/fa";
import type {
  ApprovalOperationLog,
  ApprovalResult,
  CustomerRegistration,
} from "@/types/customerRegistration";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getApiUrl, getQueryUrl } from "@/config/api";

interface ApproveRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: CustomerRegistration | null;
  onSuccess: () => void;
}

interface CustomerRegisterAddressApiResponse {
  id: number;
  parent_id: number;
  label?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  district?: string | null;
  postal_code?: string | null;
  pic_name?: string | null;
  pic_phone?: string | null;
  is_default?: number | boolean | null;
}

interface GroupParentRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  nbid?: number | null;
}

type Step = 1 | 2 | 3 | 4;

function normalizePhone(value?: string): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  return digits || undefined;
}

function normalizeDate(value?: string): string | undefined {
  if (!value || value === "-") return undefined;
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return value.split("T")[0];
}

function extractIdFromResourceResponse(json: unknown): number | undefined {
  if (
    json &&
    typeof json === "object" &&
    "data" in json &&
    json.data &&
    typeof json.data === "object" &&
    "id" in json.data
  ) {
    const raw = (json.data as { id?: unknown }).id;
    if (typeof raw === "number") return raw;
    if (typeof raw === "string") {
      const parsed = Number.parseInt(raw, 10);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

export function ApproveRegistrationModal({
  isOpen,
  onClose,
  registration,
  onSuccess,
}: ApproveRegistrationModalProps) {
  const { token } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [createNationalBrand, setCreateNationalBrand] = useState(false);
  const [nbName, setNbName] = useState("");
  const [gpName, setGpName] = useState("");
  const [gcName, setGcName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [operationLogs, setOperationLogs] = useState<ApprovalOperationLog[]>([]);
  const [shippingAddresses, setShippingAddresses] = useState<
    CustomerRegisterAddressApiResponse[]
  >([]);
  const [existingGp, setExistingGp] = useState<GroupParentRow | null>(null);
  const [createdGp, setCreatedGp] = useState<GroupParentRow | null>(null);
  const [result, setResult] = useState<ApprovalResult | null>(null);

  const existingGpid = registration?.gp_id;
  const existingGcid = registration?.gc_id;
  const existingBcid = registration?.bc_id;
  const existingNbid = registration?.master_links?.nb_id;

  const effectiveShippingAddresses = useMemo(() => {
    if (!registration) return [] as CustomerRegisterAddressApiResponse[];
    if (registration.same_as_company_address) {
      return [
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
          is_default: 1,
        },
      ];
    }
    return shippingAddresses;
  }, [registration, shippingAddresses]);

  const pushLog = useCallback((log: ApprovalOperationLog) => {
    setOperationLogs((prev) => [...prev, log]);
    console.log("[ApproveFlow]", log);
  }, []);

  const apiJsonRequest = useCallback(
    async (
      stage: string,
      url: string,
      method: "GET" | "POST" | "PUT",
      body?: unknown
    ) => {
      pushLog({ stage, status: "started", message: `${method} ${url}`, payload: body });

      const res = await apiFetch(
        url,
        { method, cache: "no-store", ...(body ? { body: JSON.stringify(body) } : {}) },
        token
      );

      let json: unknown = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok) {
        const serverMessage =
          json &&
          typeof json === "object" &&
          "message" in json &&
          typeof json.message === "string"
            ? json.message
            : "";
        const message = `Failed ${stage} (HTTP ${res.status})${
          serverMessage ? `: ${serverMessage}` : ""
        }`;
        pushLog({
          stage,
          status: "failed",
          message,
          response: json,
          http_status: res.status,
        });
        throw new Error(message);
      }

      pushLog({
        stage,
        status: "success",
        message: `${stage} success`,
        response: json,
        http_status: res.status,
      });
      return json;
    },
    [pushLog, token]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadPreparationData() {
      if (!isOpen || !registration || !token) return;

      setStep(1);
      setCreateNationalBrand(false);
      setNbName(registration.user.full_name || "");
      setGpName(`${registration.user.full_name || registration.company.name} GP`);
      setGcName(`${registration.user.full_name || registration.company.name} GC`);
      setIsSubmitting(false);
      setError(null);
      setOperationLogs([]);
      setResult(null);
      setExistingGp(null);
      setCreatedGp(null);
      setIsPreparing(true);

      try {
        const regId = Number(registration.id);
        const shippingSpec = {
          fields: ["*"],
          filters: [
            ["parent_id", "=", regId],
            ["parent_type", "=", "customer_register"],
          ],
        };
        const shippingRes = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_ADDRESS, shippingSpec),
          { method: "GET", cache: "no-store" },
          token
        );
        const shippingJson = await shippingRes.json();
        if (!cancelled) {
          setShippingAddresses(Array.isArray(shippingJson?.data) ? shippingJson.data : []);
        }

        if (registration.gp_id) {
          const gpRes = await apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
              fields: ["*"],
              filters: [["id", "=", registration.gp_id]],
              limit: 1,
            }),
            { method: "GET", cache: "no-store" },
            token
          );
          const gpJson = await gpRes.json();
          const gpRow = Array.isArray(gpJson?.data) ? gpJson.data[0] : null;
          if (!cancelled && gpRow) {
            setExistingGp(gpRow);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Gagal mempersiapkan data approval");
        }
      } finally {
        if (!cancelled) {
          setIsPreparing(false);
        }
      }
    }

    loadPreparationData();

    return () => {
      cancelled = true;
    };
  }, [isOpen, registration, token]);

  const buildGroupCustomerPayload = useCallback(
    (gpid: number) => {
      if (!registration) return null;
      return {
        gc_name: gcName,
        gpid,
        owner_full_name: registration.user.full_name,
        owner_phone: normalizePhone(registration.user.phone),
        owner_email: registration.user.email,
        owner_place_of_birth: registration.user.place_of_birth,
        owner_date_of_birth: normalizeDate(registration.user.date_of_birth),
        company_type: registration.company.company_type,
        company_title: registration.company.company_title,
        company_name: registration.company.name,
      };
    },
    [gcName, registration]
  );

  const buildBranchCustomerPayload = useCallback(
    (gcid: number) => {
      if (!registration) return null;

      const officeAddress = {
        type: "office",
        label: "Office",
        address: registration.address.full_address,
        city: registration.address.city_name,
        district: registration.address.district_name,
        province: registration.address.province_name,
        postal_code: registration.address.postal_code,
      };

      const warehouseAddresses = effectiveShippingAddresses.map((addr) => ({
        type: "warehouse",
        label: addr.label || "Warehouse",
        address: addr.address || "",
        city: addr.city || "",
        district: addr.district || "",
        province: addr.province || "",
        postal_code: addr.postal_code || "",
        pic_name: addr.pic_name || undefined,
        pic_phone: normalizePhone(addr.pic_phone || undefined),
        is_default: addr.is_default ? 1 : undefined,
      }));

      return {
        gcid,
        branch: registration.company.branch_id,
        product_need: registration.company.product_need,
        branch_owner:
          registration.branch_owner?.full_name || registration.user.full_name,
        branch_owner_email: registration.branch_owner?.email || registration.user.email,
        branch_owner_phone: normalizePhone(
          registration.branch_owner?.phone || registration.user.phone
        ),
        branch_owner_place_of_birth:
          registration.branch_owner?.place_of_birth || registration.user.place_of_birth,
        branch_owner_date_of_birth: normalizeDate(
          registration.branch_owner?.date_of_birth || registration.user.date_of_birth
        ),
        customer_register: Number(registration.id),
        customer_address: [officeAddress, ...warehouseAddresses],
      };
    },
    [effectiveShippingAddresses, registration]
  );

  const buildCustomerRegisterApprovePayload = useCallback(
    (ids: ApprovalResult) => {
      const shippingPayload = effectiveShippingAddresses.map((addr) => ({
        label: addr.label || "Warehouse",
        pic_name: addr.pic_name || undefined,
        pic_phone: normalizePhone(addr.pic_phone || undefined),
        address: addr.address || "",
        city: addr.city || "",
        district: addr.district || "",
        postal_code: addr.postal_code || "",
        province: addr.province || "",
        is_default: addr.is_default ? 1 : undefined,
      }));

      return {
        status: "Approved",
        docstatus: 1,
        same_as_company_address: registration?.same_as_company_address ? 1 : 0,
        gpid: ids.gpid,
        gcid: ids.gcid,
        bcid: ids.bcid,
        ...(ids.nbid ? { nbid: ids.nbid } : {}),
        customer_shipping_address: shippingPayload,
      };
    },
    [effectiveShippingAddresses, registration?.same_as_company_address]
  );

  const validateCurrentStep = (): string | null => {
    if (step === 1 && !existingGpid) {
      if (createNationalBrand && !nbName.trim()) {
        return "Nama National Brand wajib diisi";
      }
      if (!gpName.trim()) {
        return "Nama Group Parent wajib diisi";
      }
    }

    if (step === 2 && !existingGcid) {
      if (!gcName.trim()) {
        return "GC Name wajib diisi";
      }
    }

    return null;
  };

  const handleNextStep = () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((prev) => (Math.min(4, prev + 1) as Step));
  };

  const handleSubmitApproval = async () => {
    if (!registration || !token) {
      setError("Data tidak lengkap");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      let nbid: number | undefined = existingNbid;

      let gpid: number;
      if (existingGpid) {
        gpid = existingGpid;
      } else {
        if (createNationalBrand) {
          const nbJson = await apiJsonRequest(
            "creating National Brand",
            getApiUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND),
            "POST",
            { nb_name: nbName.trim() }
          );
          const createdNbid = extractIdFromResourceResponse(nbJson);
          if (!createdNbid) throw new Error("Failed creating National Brand (missing id)");
          nbid = createdNbid;
        }

        const gpPayload = {
          gp_name: gpName.trim(),
          ...(nbid ? { nbid } : {}),
        };
        const gpJson = await apiJsonRequest(
          "creating Group Parent",
          getApiUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT),
          "POST",
          gpPayload
        );
        const createdGpid = extractIdFromResourceResponse(gpJson);
        if (!createdGpid) throw new Error("Failed creating Group Parent (missing id)");
        gpid = createdGpid;

        if (
          gpJson &&
          typeof gpJson === "object" &&
          "data" in gpJson &&
          gpJson.data &&
          typeof gpJson.data === "object"
        ) {
          const row = gpJson.data as GroupParentRow;
          setCreatedGp({
            id: createdGpid,
            name: row.name,
            gp_name: row.gp_name,
            nbid: row.nbid,
          });
        }
      }

      let gcid: number;
      if (existingGcid) {
        gcid = existingGcid;
      } else {
        const gcPayload = buildGroupCustomerPayload(gpid);
        if (!gcPayload) throw new Error("Payload Group Customer tidak valid");

        const gcJson = await apiJsonRequest(
          "creating Group Customer",
          getApiUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER),
          "POST",
          gcPayload
        );
        const createdGcid = extractIdFromResourceResponse(gcJson);
        if (!createdGcid) throw new Error("Failed creating Group Customer (missing id)");
        gcid = createdGcid;
      }

      let bcid: number;
      if (existingBcid) {
        bcid = existingBcid;
      } else {
        const bcPayload = buildBranchCustomerPayload(gcid);
        if (!bcPayload) throw new Error("Payload Branch Customer tidak valid");

        const bcJson = await apiJsonRequest(
          "creating Branch Customer",
          getApiUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2),
          "POST",
          bcPayload
        );
        const createdBcid = extractIdFromResourceResponse(bcJson);
        if (!createdBcid) throw new Error("Failed creating Branch Customer (missing id)");
        bcid = createdBcid;
      }

      const userId =
        Number(registration.ekaplus_user?.id ?? registration.user.user_id) || 0;
      if (userId > 0) {
        try {
          await apiJsonRequest(
            "creating member_of owner gpid",
            getApiUrl(API_CONFIG.ENDPOINTS.MEMBER_OF),
            "POST",
            { user: userId, ref_type: "gpid", ref_id: gpid, is_owner: 1 }
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message.toLowerCase() : "";
          if (
            !msg.includes("duplicate") &&
            !msg.includes("unique") &&
            !msg.includes("already") &&
            !msg.includes("terdaftar") &&
            !msg.includes("conflict")
          ) {
            throw err;
          }
          pushLog({
            stage: "creating member_of owner gpid",
            status: "success",
            message: "Duplicate member_of treated as success",
          });
        }
      }

      const finalResult: ApprovalResult = { nbid, gpid, gcid, bcid };
      const updatePayload = buildCustomerRegisterApprovePayload(finalResult);
      await apiJsonRequest(
        "updating customer_register approved",
        getApiUrl(`${API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER}/${registration.id}`),
        "PUT",
        updatePayload
      );

      setResult(finalResult);
      window.dispatchEvent(new Event("ekatalog:customer_registrations_update"));
      window.dispatchEvent(new Event("ekatalog:gp_update"));
      window.dispatchEvent(new Event("ekatalog:gc_update"));
      window.dispatchEvent(new Event("ekatalog:bc_update"));

      alert(
        `Registrasi "${registration.company.name}" berhasil diapprove!\n\n` +
          `GP ID: ${gpid}\nGC ID: ${gcid}\nBC ID: ${bcid}${
            nbid ? `\nNB ID: ${nbid}` : ""
          }`
      );
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal approve registrasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registration) return null;

  const gpDisplay = createdGp || existingGp;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-5 flex items-center gap-3">
              <FaCheckCircle className="w-7 h-7 text-white" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">Approve Registrasi Customer</h2>
                <p className="text-sm text-green-100 mt-0.5">
                  Step {step}: {step === 1 && "Group Parent"}
                  {step === 2 && "Group Customer"}
                  {step === 3 && "Branch Customer"}
                  {step === 4 && "Review & Commit"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                  Registrasi Customer
                </p>
                <p className="text-lg font-bold text-blue-900">{registration.company.name}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-blue-700">
                  <div className="flex items-center gap-1">
                    <FaBuilding className="w-3.5 h-3.5" />
                    <span>{registration.company.business_type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="w-3.5 h-3.5" />
                    <span>{registration.company.branch_name}</span>
                  </div>
                </div>
              </div>

              {isPreparing && (
                <div className="text-sm text-gray-600">Menyiapkan data approval...</div>
              )}

              {!isPreparing && step === 1 && (
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">Group Parent</h3>

                  {existingGpid ? (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-900">
                      <p className="font-semibold">Group Parent sudah ada, tidak bisa membuat baru.</p>
                      <p className="mt-1">
                        {gpDisplay?.gp_name || registration.gp_name || "-"} (GPID: {gpDisplay?.name || registration.gp_name || `GP${existingGpid}`})
                      </p>
                    </div>
                  ) : (
                    <>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={createNationalBrand}
                          onChange={(e) => setCreateNationalBrand(e.target.checked)}
                        />
                        <span className="text-sm">Buat National Brand baru (opsional)</span>
                      </label>

                      {createNationalBrand && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            National Brand Name
                          </label>
                          <input
                            value={nbName}
                            onChange={(e) => setNbName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                            placeholder="Contoh: Yuda Prayoga"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Group Parent Name
                        </label>
                        <input
                          value={gpName}
                          onChange={(e) => setGpName(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                          placeholder="Contoh: Yuda Prayoga GP"
                        />
                      </div>
                    </>
                  )}
                </section>
              )}

              {!isPreparing && step === 2 && (
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">Group Customer</h3>

                  {existingGcid ? (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-900">
                      <p className="font-semibold">Group Customer sudah ada.</p>
                      <p className="mt-1">GC ID: {existingGcid}</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          GC Name (editable)
                        </label>
                        <input
                          value={gcName}
                          onChange={(e) => setGcName(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                        />
                      </div>

                      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-sm space-y-1">
                        <p>
                          <span className="font-semibold">GPID:</span>{" "}
                          {existingGpid
                            ? gpDisplay?.name || `GP${existingGpid}`
                            : "(akan dibuat)"}
                        </p>
                        <p><span className="font-semibold">Owner:</span> {registration.user.full_name}</p>
                        <p><span className="font-semibold">Phone:</span> {registration.user.phone}</p>
                        <p><span className="font-semibold">Email:</span> {registration.user.email}</p>
                        <p><span className="font-semibold">Company:</span> {registration.company.name}</p>
                      </div>
                    </>
                  )}
                </section>
              )}

              {!isPreparing && step === 3 && (
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">Branch Customer</h3>

                  {existingBcid ? (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-900">
                      <p className="font-semibold">Branch Customer sudah ada.</p>
                      <p className="mt-1">BC ID: {existingBcid}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-sm space-y-1">
                      <p className="font-semibold">Payload Branch Customer (read-only)</p>
                      <p><span className="font-semibold">Branch:</span> {registration.company.branch_id}</p>
                      <p><span className="font-semibold">Product Need:</span> {registration.company.product_need || "-"}</p>
                      <p><span className="font-semibold">Branch Owner:</span> {registration.branch_owner?.full_name || registration.user.full_name}</p>
                      <p><span className="font-semibold">Shipping Rows:</span> {effectiveShippingAddresses.length}</p>
                    </div>
                  )}
                </section>
              )}

              {!isPreparing && step === 4 && (
                <section className="space-y-4">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <FaInfoCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold">Review Final</p>
                      <p className="text-blue-700">
                        Sistem akan create data yang masih null (GP/GC/BC) lalu update customer_register menjadi Approved.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
                    <p><span className="font-semibold">Existing GP:</span> {existingGpid || "null"}</p>
                    <p><span className="font-semibold">Existing GC:</span> {existingGcid || "null"}</p>
                    <p><span className="font-semibold">Existing BC:</span> {existingBcid || "null"}</p>
                    <p><span className="font-semibold">Same as Company Address:</span> {registration.same_as_company_address ? "Yes" : "No"}</p>
                  </div>

                  {result && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-800">
                      Result: NB {result.nbid || "-"}, GP {result.gpid}, GC {result.gcid}, BC {result.bcid}
                    </div>
                  )}
                </section>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <FaExclamationTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {operationLogs.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaListUl className="w-4 h-4" />
                    Operation Log
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {operationLogs.map((log, idx) => (
                      <div key={`${log.stage}-${idx}`} className="text-xs">
                        <span
                          className={`font-semibold ${
                            log.status === "failed"
                              ? "text-red-600"
                              : log.status === "success"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          [{log.status.toUpperCase()}]
                        </span>{" "}
                        <span className="text-gray-700">{log.stage}</span>{" "}
                        <span className="text-gray-500">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-between gap-3 border-t border-gray-200">
              {step > 1 ? (
                <button
                  onClick={() => setStep((prev) => Math.max(1, prev - 1) as Step)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
              ) : (
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
              )}

              {step < 4 ? (
                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  onClick={handleNextStep}
                  disabled={isSubmitting || isPreparing}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  onClick={handleSubmitApproval}
                  disabled={isSubmitting || isPreparing}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="w-4 h-4" />
                      <span>Commit Approve</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
