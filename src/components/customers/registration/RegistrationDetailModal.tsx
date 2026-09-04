"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { CustomerRegistration } from "@/types/customerRegistration";
import { EditRegistrationModal } from "./EditRegistrationModal";
import { motion } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import {
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaLink,
  FaDatabase,
  FaSyncAlt,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getFileUrl, getQueryUrl } from "@/config/api";
import {
  fetchPaymentAccountInfo,
  type PaymentAccountInfo,
} from "@/utils/paymentAccount";
import { ResourceHistory } from "@/components/customers/ResourceHistory";

interface RegistrationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: CustomerRegistration | null;
  demoMode?: boolean;
  onDemoRegistrationChange?: (registration: CustomerRegistration) => void;
  onApprove?: (registration: CustomerRegistration) => void;
  onReject?: (registration: CustomerRegistration) => void;
  onEdit?: () => void;
  onSync?: (registration: CustomerRegistration) => void;
  onRollback?: (registration: CustomerRegistration) => void;
  isSyncing?: boolean;
  isRollbacking?: boolean;
  syncLabel?: string;
  syncReadOnly?: boolean;
  rollbackLabel?: string;
  rollbackReadOnly?: boolean;
}

interface CustomerRegisterAddressApiResponse {
  id: number;
  parent_id: number;
  label?: string | null;
  type?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  district?: string | null;
  village?: string | null;
  postal_code?: string | null;
  country?: string | null;
  pic_name?: string | null;
  pic_phone?: string | null;
  is_default?: number | boolean | null;
}

interface CustomerRegisterContactApiResponse {
  id: number;
  full_name?: string | null;
  display_name?: string | null;
  position_id?: number | string | null;
  identity_type?: string | null;
  handle?: string | null;
}

interface CustomerPositionApiResponse {
  id: number;
  position_name?: string | null;
}

function normalizeShippingLabel(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function isCompanyAddressShippingRow(
  row?: CustomerRegisterAddressApiResponse | null,
) {
  const label = normalizeShippingLabel(row?.label);
  return label === "alamat perusahaan" || label === "alamatperusahaan";
}

function formatIdentityType(value?: string | null) {
  const normalized = (value || "").trim().toLowerCase();
  if (!normalized) return "-";
  if (normalized === "whatsapp") return "WhatsApp";
  if (normalized === "ekaplus") return "Ekaplus";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function getContactHandleLabel(value?: string | null) {
  const normalized = (value || "").trim().toLowerCase();
  if (normalized === "whatsapp") return "Nomor WhatsApp";
  if (normalized === "phone") return "Nomor Telepon";
  if (normalized === "email") return "Email";
  if (normalized === "instagram") return "Username Instagram";
  if (normalized === "facebook") return "Username Facebook";
  if (normalized === "telegram") return "Username Telegram";
  if (normalized === "line") return "ID Line";
  if (normalized === "ekaplus") return "ID Ekaplus";
  return "ID / Handle";
}

async function detectAttachmentMediaType(blob: Blob): Promise<string> {
  const declaredType = blob.type.toLowerCase();
  if (declaredType.startsWith("image/") || declaredType.includes("pdf")) {
    return declaredType;
  }

  const bytes = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
  const signature = Array.from(bytes)
    .map((byte) => String.fromCharCode(byte))
    .join("");
  if (signature.startsWith("%PDF-")) return "application/pdf";
  if (signature.startsWith("RIFF") && signature.slice(8, 12) === "WEBP") {
    return "image/webp";
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  return declaredType || "application/octet-stream";
}

function blobToDataUrl(blob: Blob, mediaType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const typedBlob =
      blob.type === mediaType ? blob : new Blob([blob], { type: mediaType });
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("Format gambar tidak valid"));
    reader.onerror = () => reject(new Error("Gagal membaca data gambar"));
    reader.readAsDataURL(typedBlob);
  });
}

function ContactIdentityAttachment({
  attachment,
  token,
}: {
  attachment?: string | null;
  token?: string | null;
}) {
  const fileUrl = getFileUrl(attachment);
  const thumbnailUrl = fileUrl ? `${fileUrl}?format=q:50/ext:webp` : undefined;
  const previewUrl = fileUrl ? `${fileUrl}?ext:webp` : undefined;
  const [thumbnailBlobUrl, setThumbnailBlobUrl] = useState<string | null>(null);
  const [thumbnailMediaType, setThumbnailMediaType] = useState<string | null>(
    null,
  );
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewMediaType, setPreviewMediaType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAttachment() {
      setPreviewOpen(false);
      setPreviewBlobUrl(null);
      setPreviewMediaType(null);
      setPreviewError(null);

      if (!thumbnailUrl || !token) {
        setThumbnailBlobUrl(null);
        setThumbnailMediaType(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiFetch(
          thumbnailUrl,
          { method: "GET", cache: "no-store" },
          token,
        );
        if (!response.ok) {
          throw new Error(`Gagal memuat lampiran (${response.status})`);
        }

        const blob = await response.blob();
        const mediaType = await detectAttachmentMediaType(blob);
        const attachmentDataUrl = await blobToDataUrl(blob, mediaType);
        if (!cancelled) {
          setThumbnailBlobUrl(attachmentDataUrl);
          setThumbnailMediaType(mediaType);
        }
      } catch (loadError) {
        if (!cancelled) {
          setThumbnailBlobUrl(null);
          setThumbnailMediaType(null);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat lampiran identitas",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadAttachment();
    return () => {
      cancelled = true;
    };
  }, [thumbnailUrl, token]);

  const openPreview = async () => {
    setPreviewOpen(true);
    if (previewBlobUrl || previewLoading || !previewUrl || !token) return;

    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const response = await apiFetch(
        previewUrl,
        { method: "GET", cache: "no-store" },
        token,
      );
      if (!response.ok) {
        throw new Error(`Gagal memuat preview (${response.status})`);
      }
      const blob = await response.blob();
      const mediaType = await detectAttachmentMediaType(blob);
      setPreviewBlobUrl(await blobToDataUrl(blob, mediaType));
      setPreviewMediaType(mediaType);
    } catch (previewLoadError) {
      setPreviewError(
        previewLoadError instanceof Error
          ? previewLoadError.message
          : "Gagal memuat preview besar",
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Identity Attachment
      </label>
      {!attachment ? <p className="text-sm text-gray-900">-</p> : null}
      {loading ? (
        <p className="text-sm text-gray-500">Memuat lampiran...</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!loading && !error && thumbnailBlobUrl ? (
        <button
          type="button"
          onClick={() => void openPreview()}
          className="block w-full overflow-hidden rounded-lg border border-gray-200 bg-white"
          title="Buka gambar lampiran"
        >
          <div className="h-64 w-full md:h-80">
            {thumbnailMediaType?.includes("pdf") ? (
              <iframe
                src={thumbnailBlobUrl}
                title="Identity Attachment PDF"
                className="pointer-events-none h-full w-full"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailBlobUrl}
                alt="Identity Attachment"
                className="h-full w-full object-contain"
              />
            )}
          </div>
        </button>
      ) : null}
      {!loading && !error && thumbnailBlobUrl ? (
        <p className="mt-1 text-xs text-gray-500">
          Klik lampiran untuk membuka preview lebih besar.
        </p>
      ) : null}

      {previewOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setPreviewOpen(false);
          }}
        >
          <div className="relative h-[85vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-xl bg-white/90 p-2 text-gray-700 shadow hover:bg-white"
              aria-label="Tutup preview"
            >
              <HiXMark className="h-6 w-6" />
            </button>
            {previewLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Memuat preview lampiran...
              </div>
            ) : null}
            {previewError ? (
              <div className="flex h-full items-center justify-center p-6 text-sm text-red-600">
                {previewError}
              </div>
            ) : null}
            {!previewLoading && !previewError && previewBlobUrl ? (
              <div className="h-full w-full bg-gray-100">
                {previewMediaType?.includes("pdf") ? (
                  <iframe
                    src={previewBlobUrl}
                    title="Preview Identity Attachment PDF"
                    className="h-full w-full"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewBlobUrl}
                    alt="Preview Identity Attachment"
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function RegistrationDetailModal({
  isOpen,
  onClose,
  registration,
  demoMode = false,
  onDemoRegistrationChange,
  onApprove,
  onReject,
  onEdit,
  onSync,
  onRollback,
  isSyncing = false,
  isRollbacking = false,
  syncLabel = "Sync",
  syncReadOnly = false,
  rollbackLabel = "Rollback",
  rollbackReadOnly = false,
}: RegistrationDetailModalProps) {
  const { token } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState<
    CustomerRegisterAddressApiResponse[]
  >([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<
    CustomerRegisterContactApiResponse[]
  >([]);
  const [positionsById, setPositionsById] = useState<Map<number, string>>(
    new Map(),
  );
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [paymentAccountInfo, setPaymentAccountInfo] =
    useState<PaymentAccountInfo | null>(null);
  const [paymentAccountError, setPaymentAccountError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadShippingAddresses() {
      if (!isOpen || !registration?.id) return;
      if (demoMode) {
        setShippingAddresses(
          (registration.shipping_addresses || []).map((item, index) => ({
            id: item.id || index + 1,
            parent_id: Number(registration.id) || index + 1,
            label: item.label,
            type: item.type,
            email: item.email,
            address: item.address,
            city: item.city,
            province: item.province,
            district: item.district || null,
            village: item.village || null,
            postal_code: item.postal_code || null,
            pic_name: item.pic_name || null,
            pic_phone: item.pic_phone || null,
            is_default: item.is_default || null,
          })),
        );
        setShippingLoading(false);
        setShippingError(null);
        return;
      }
      if (!token) return;

      setShippingLoading(true);
      setShippingError(null);

      try {
        const spec = {
          fields: ["*"],
          filters: [
            ["parent_id", "=", Number(registration.id)],
            ["parent_type", "=", "customer_register"],
          ],
        };

        const res = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_ADDRESS, spec),
          { method: "GET", cache: "no-store" },
          token,
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch shipping addresses (${res.status})`);
        }

        const json = await res.json();
        if (!cancelled) {
          setShippingAddresses(Array.isArray(json.data) ? json.data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setShippingError(
            err instanceof Error
              ? err.message
              : "Gagal memuat alamat pengiriman",
          );
          setShippingAddresses([]);
        }
      } finally {
        if (!cancelled) {
          setShippingLoading(false);
        }
      }
    }

    loadShippingAddresses();

    return () => {
      cancelled = true;
    };
  }, [demoMode, isOpen, registration, registration?.id, token]);

  useEffect(() => {
    let cancelled = false;

    async function loadContacts() {
      if (!isOpen || !registration?.id) return;
      if (demoMode || !token) {
        setContacts([]);
        setPositionsById(new Map());
        setContactsLoading(false);
        setContactsError(null);
        return;
      }

      setContactsLoading(true);
      setContactsError(null);

      try {
        const [contactsResponse, positionsResponse] = await Promise.all([
          apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_CONTACT, {
              fields: ["*"],
              filters: [["parent_id", "=", Number(registration.id)]],
              limit: 100,
            }),
            { method: "GET", cache: "no-store" },
            token,
          ),
          apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_POSITION, {
              fields: ["id", "position_name"],
              limit: 100,
            }),
            { method: "GET", cache: "no-store" },
            token,
          ),
        ]);

        if (!contactsResponse.ok) {
          throw new Error(
            `Failed to fetch customer contacts (${contactsResponse.status})`,
          );
        }

        const contactsJson = await contactsResponse.json();
        const contactRows = Array.isArray(contactsJson?.data)
          ? (contactsJson.data as CustomerRegisterContactApiResponse[])
          : [];

        let nextPositions = new Map<number, string>();
        if (positionsResponse.ok) {
          const positionsJson = await positionsResponse.json();
          const positionRows = Array.isArray(positionsJson?.data)
            ? (positionsJson.data as CustomerPositionApiResponse[])
            : [];
          nextPositions = new Map(
            positionRows
              .filter((item) => Number(item.id) > 0)
              .map((item) => [
                Number(item.id),
                item.position_name || `Position ${item.id}`,
              ]),
          );
        }

        if (!cancelled) {
          setContacts(contactRows);
          setPositionsById(nextPositions);
          if (!positionsResponse.ok) {
            setContactsError(
              "Kontak berhasil dimuat, tetapi nama jabatan belum bisa dimuat.",
            );
          }
        }
      } catch (error) {
        if (!cancelled) {
          setContacts([]);
          setPositionsById(new Map());
          setContactsError(
            error instanceof Error
              ? error.message
              : "Gagal memuat contact person",
          );
        }
      } finally {
        if (!cancelled) setContactsLoading(false);
      }
    }

    void loadContacts();

    return () => {
      cancelled = true;
    };
  }, [demoMode, isOpen, registration?.id, token]);

  useEffect(() => {
    let cancelled = false;

    async function loadPaymentAccount() {
      if (demoMode) {
        setPaymentAccountInfo(null);
        setPaymentAccountError(null);
        return;
      }
      if (
        !isOpen ||
        !token ||
        !registration?.id ||
        !registration.support_data.payment_account
      ) {
        setPaymentAccountInfo(null);
        setPaymentAccountError(null);
        return;
      }

      try {
        setPaymentAccountError(null);
        const info = await fetchPaymentAccountInfo({
          registrationId: registration.id,
          branchId: registration.company.branch_id,
          paymentAccount: registration.support_data.payment_account,
          authToken: token,
        });
        if (!cancelled) {
          setPaymentAccountInfo(info);
        }
      } catch (error) {
        if (!cancelled) {
          setPaymentAccountInfo(null);
          setPaymentAccountError(
            error instanceof Error ? error.message : "Gagal memuat rekening",
          );
        }
      }
    }

    void loadPaymentAccount();

    return () => {
      cancelled = true;
    };
  }, [
    demoMode,
    isOpen,
    registration?.id,
    registration?.company.branch_id,
    registration?.support_data.payment_account,
    token,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditModalOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsEditModalOpen(false);
  }, [registration?.id]);

  const formatPhoneNumber = (phone: string) => {
    if (!phone || phone === "-") return "-";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("62")) {
      return "0" + cleaned.substring(2);
    }
    return cleaned;
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "-") return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const displayValue = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  };

  const getStatusBadgeClass = (docstatus?: number) => {
    if (docstatus === 1) return "bg-green-100 text-green-700 border-green-200";
    if (docstatus === 2) return "bg-red-100 text-red-700 border-red-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const normalizedStatus = (registration?.status || "").toLowerCase();
  const sagaStatus = (registration?.sync_info?.saga_status || "").toLowerCase();
  const hasSagaStatus = Boolean(sagaStatus);
  const hasSagaId = Boolean(registration?.sync_info?.sync_saga_id);
  const canShowSyncButton =
    Boolean(onSync) && hasSagaStatus && sagaStatus !== "completed";
  const canShowRollbackButton = Boolean(onRollback) && hasSagaId;
  const canManageRegistration =
    normalizedStatus === "draft" || normalizedStatus === "request";
  const rejectReason =
    registration?.reject_reason || registration?.rejection_reason || "-";
  const rejectNotes =
    registration?.reject_notes || registration?.rejection_notes || "-";

  const effectiveShippingAddresses = useMemo(() => {
    if (!registration) return [] as CustomerRegisterAddressApiResponse[];
    if (registration.same_as_company_address) {
      return [];
    }
    return shippingAddresses.filter(
      (item) => !isCompanyAddressShippingRow(item),
    );
  }, [registration, shippingAddresses]);

  const companyAddress = useMemo(() => {
    if (!registration) return null;
    const storedCompanyAddress = shippingAddresses.find(
      isCompanyAddressShippingRow,
    );
    if (storedCompanyAddress) return storedCompanyAddress;

    return {
      id: -1,
      parent_id: Number(registration.id) || -1,
      label: "Alamat Perusahaan",
      type: "Office",
      pic_name:
        registration.branch_owner?.full_name || registration.user.full_name,
      pic_phone: registration.branch_owner?.phone || registration.user.phone,
      email: registration.branch_owner?.email || registration.user.email,
      address: registration.address.full_address,
      province: registration.address.province_name,
      city: registration.address.city_name,
      district: registration.address.district_name,
      village: registration.address.village_name,
      is_default: 0,
    } satisfies CustomerRegisterAddressApiResponse;
  }, [registration, shippingAddresses]);

  if (!isOpen || !registration) return null;

  const renderAddressCard = (address: CustomerRegisterAddressApiResponse) => (
    <div
      key={address.id ?? `${address.label}-${address.address}`}
      className="rounded-xl border border-gray-200 p-4 bg-gray-50"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Label
          </label>
          <p className="font-medium text-gray-900">
            {displayValue(address.label)}
          </p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Type
          </label>
          <p className="font-medium text-gray-900">
            {displayValue(address.type)}
          </p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            PIC Name
          </label>
          <p className="text-gray-900">{displayValue(address.pic_name)}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            PIC Phone
          </label>
          <p className="text-gray-900">{displayValue(address.pic_phone)}</p>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Email
          </label>
          <p className="text-gray-900 break-all">
            {displayValue(address.email)}
          </p>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Address
          </label>
          <p className="text-gray-900 leading-relaxed">
            {displayValue(address.address)}
          </p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Province
          </label>
          <p className="text-gray-900">{displayValue(address.province)}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            City
          </label>
          <p className="text-gray-900">{displayValue(address.city)}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            District
          </label>
          <p className="text-gray-900">{displayValue(address.district)}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Village
          </label>
          <p className="text-gray-900">{displayValue(address.village)}</p>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Is Default
          </label>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
              address.is_default
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {address.is_default ? "Ya" : "Tidak"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-[#000000b3] transition-opacity"
            onClick={onClose}
          ></div>

          <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
            &#8203;
          </span>

          <div
            data-tour={demoMode ? "customer-register-detail-modal" : undefined}
            className="inline-block relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle"
          >
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <IoDocumentTextOutline className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Registration Details
                  </h2>
                  <p className="text-sm text-red-100 mt-0.5">
                    {registration.company.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {registration.sync_info?.saga_status ? (
                  <span className="px-3 py-1.5 rounded-full text-sm font-semibold border-2 bg-white text-blue-700 border-blue-200">
                    Saga: {registration.sync_info.saga_status}
                  </span>
                ) : null}
                {!canShowSyncButton && (
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 bg-white ${getStatusBadgeClass(
                      registration.docstatus,
                    )}`}
                  >
                    {getStatusLabel(registration.status)}
                  </span>
                )}
                {canShowSyncButton && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!syncReadOnly && !isSyncing) onSync?.(registration);
                    }}
                    disabled={syncReadOnly || isSyncing}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                      syncReadOnly
                        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                        : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    <FaSyncAlt className={isSyncing ? "animate-spin" : ""} />
                    <span>{isSyncing ? "Syncing..." : syncLabel}</span>
                  </button>
                )}
                {canShowRollbackButton && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!rollbackReadOnly && !isRollbacking)
                        onRollback?.(registration);
                    }}
                    disabled={rollbackReadOnly || isRollbacking}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                      rollbackReadOnly
                        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                        : "bg-white text-rose-700 border-rose-200 hover:bg-rose-50"
                    }`}
                  >
                    <FaTimesCircle />
                    <span>
                      {isRollbacking ? "Rolling back..." : rollbackLabel}
                    </span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 hover:bg-white/20 transition-colors"
                >
                  <HiXMark className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto bg-gray-50">
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <IoDocumentTextOutline className="w-4 h-4 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Data Pengajuan
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Nomor Registrasi
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {registration.registration_number || registration.id}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Source
                      </label>
                      <p className="text-sm text-gray-900 font-medium uppercase">
                        {displayValue(registration.source)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Created By
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.created_by)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Ekaplus User Full Name
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.ekaplus_user?.full_name)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Tanggal Submit
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {formatDate(registration.submission_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {normalizedStatus === "rejected" && (
                <section className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <FaTimesCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Informasi Rejection
                    </h3>
                  </div>
                  <div className="bg-white rounded-xl border border-red-200 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Reject Reason
                        </label>
                        <p className="text-sm text-red-700 font-semibold">
                          {displayValue(rejectReason)}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Reject Notes
                        </label>
                        <p className="text-sm text-gray-900 bg-red-50 border border-red-100 rounded-lg p-3 whitespace-pre-wrap">
                          {displayValue(rejectNotes)}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaBuilding className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Informasi Perusahaan
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Company Type
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.company.company_type)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Company Title
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.company.company_title)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Company Name
                      </label>
                      <p className="text-sm text-gray-900 font-bold">
                        {registration.company.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Product Name
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.company.product_need)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Tax Status
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {Number(registration.company.tax_status || 0) === 1
                          ? "PKP"
                          : "NON PKP"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        NPWP
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.company.npwp)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Payment Method
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.support_data.payment_method)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Sales Team
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.support_data.sales_team)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Informasi Rekening
                      </label>
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Nomor Rekening
                          </p>
                          <p className="text-sm text-gray-900 font-medium">
                            {displayValue(
                              registration.support_data.payment_account,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Nama Rekening
                          </p>
                          <p className="text-sm text-gray-900 font-medium">
                            {displayValue(paymentAccountInfo?.nama_rekening)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Bank
                          </p>
                          <p className="text-sm text-gray-900 font-medium">
                            {displayValue(paymentAccountInfo?.bank)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {paymentAccountError ? (
                      <p className="md:col-span-2 text-xs text-amber-700">
                        Detail nama rekening dan bank belum bisa dimuat dari
                        ERP. Nomor rekening tetap ditampilkan dari customer
                        register.
                      </p>
                    ) : null}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Notes
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg p-3 whitespace-pre-wrap">
                        {displayValue(
                          registration.support_data.more_information,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Identitas</h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FaUser className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Pemilik
                      </h4>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Nama Lengkap
                          </label>
                          <p className="text-sm text-gray-900 font-medium">
                            {registration.user.full_name}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            No. Handphone
                          </label>
                          <div className="flex items-center gap-2">
                            <FaPhone className="w-3 h-3 text-gray-400" />
                            <p className="text-sm text-gray-900 font-medium">
                              {formatPhoneNumber(registration.user.phone)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Email
                          </label>
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="w-3 h-3 text-gray-400" />
                            <p className="text-sm text-gray-900 font-medium">
                              {registration.user.email}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Tempat Lahir
                          </label>
                          <p className="text-sm text-gray-900 font-medium">
                            {registration.user.place_of_birth}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Tanggal Lahir
                          </label>
                          <p className="text-sm text-gray-900 font-medium">
                            {formatDate(registration.user.date_of_birth)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-cyan-50 rounded-lg flex items-center justify-center">
                        <FaUser className="w-3.5 h-3.5 text-cyan-600" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">
                        PIC Branch
                      </h4>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Nama Lengkap
                          </label>
                          <p className="text-sm text-gray-900 font-medium">
                            {displayValue(registration.branch_owner?.full_name)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            No. Handphone
                          </label>
                          <div className="flex items-center gap-2">
                            <FaPhone className="w-3 h-3 text-gray-400" />
                            <p className="text-sm text-gray-900 font-medium">
                              {formatPhoneNumber(
                                registration.branch_owner?.phone || "-",
                              )}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Email
                          </label>
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="w-3 h-3 text-gray-400" />
                            <p className="text-sm text-gray-900 font-medium">
                              {displayValue(registration.branch_owner?.email)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Tempat Lahir
                          </label>
                          <p className="text-sm text-gray-900 font-medium">
                            {displayValue(
                              registration.branch_owner?.place_of_birth,
                            )}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Tanggal Lahir
                          </label>
                          <p className="text-sm text-gray-900 font-medium">
                            {formatDate(
                              registration.branch_owner?.date_of_birth || "-",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <IoDocumentTextOutline className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Attachment
                  </h3>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <ContactIdentityAttachment
                    attachment={registration.identity_attachment}
                    token={token}
                  />
                </div>
              </section>

              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Contact Person
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  {contactsLoading ? (
                    <p className="text-sm text-gray-500">
                      Memuat contact person...
                    </p>
                  ) : null}

                  {contactsError ? (
                    <p className="mb-4 text-sm text-amber-700">
                      {contactsError}
                    </p>
                  ) : null}

                  {!contactsLoading && contacts.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Tidak ada contact person.
                    </p>
                  ) : null}

                  {contacts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contacts.map((contact) => {
                        const positionId = Number(contact.position_id || 0);
                        const positionName =
                          positionsById.get(positionId) || contact.position_id;

                        return (
                          <div
                            key={contact.id}
                            className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  Nama Lengkap
                                </label>
                                <p className="font-medium text-gray-900">
                                  {displayValue(contact.full_name)}
                                </p>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  Nama Tampilan
                                </label>
                                <p className="font-medium text-gray-900">
                                  {displayValue(contact.display_name)}
                                </p>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  Jabatan
                                </label>
                                <p className="text-gray-900">
                                  {displayValue(positionName)}
                                </p>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  Tipe Kontak
                                </label>
                                <p className="text-gray-900">
                                  {formatIdentityType(contact.identity_type)}
                                </p>
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  {getContactHandleLabel(contact.identity_type)}
                                </label>
                                <p className="font-medium text-gray-900 break-all">
                                  {displayValue(contact.handle)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </section>

              {/* <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FaLink className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Data Pendukung
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                  </div>
                </div>
              </section> */}

              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Alamat</h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                        <FaBuilding className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Alamat Perusahaan
                      </h4>
                    </div>
                    {companyAddress && renderAddressCard(companyAddress)}
                  </div>

                  <div className="border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center">
                        <FaMapMarkerAlt className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Alamat Lainnya
                      </h4>
                    </div>
                    {/* <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Sama dengan alamat perusahaan:
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        registration.same_as_company_address
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {registration.same_as_company_address ? "Ya" : "Tidak"}
                    </span>
                  </div> */}

                    {shippingLoading && (
                      <div className="text-sm text-gray-500">
                        Memuat alamat pengiriman...
                      </div>
                    )}

                    {shippingError && (
                      <div className="text-sm text-red-600">
                        {shippingError}
                      </div>
                    )}

                    {!shippingLoading &&
                      !shippingError &&
                      effectiveShippingAddresses.length === 0 && (
                        <div className="text-sm text-gray-500">
                          {registration.same_as_company_address
                            ? "Alamat pengiriman mengikuti alamat perusahaan."
                            : "Tidak ada alamat pengiriman."}
                        </div>
                      )}

                    {!shippingLoading &&
                      !shippingError &&
                      effectiveShippingAddresses.length > 0 && (
                        <div className="space-y-4">
                          {effectiveShippingAddresses.map(renderAddressCard)}
                        </div>
                      )}
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FaLink className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Relasi Master Data
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        National Brand (NB)
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium">
                        {displayValue(
                          registration.master_links?.nb_name ||
                            registration.master_links?.nb_id,
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Group Parent (GP)
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium">
                        {displayValue(
                          registration.master_links?.gp_name ||
                            registration.master_links?.gp_id,
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Group Customer (GC)
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium">
                        {displayValue(
                          registration.master_links?.gc_name ||
                            registration.master_links?.gc_id,
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Branch Customer (BC)
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium">
                        {displayValue(
                          registration.master_links?.bc_name ||
                            registration.master_links?.bc_id,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FaDatabase className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Data Sinkronisasi
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Sync Saga ID
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium break-all">
                        {displayValue(registration.sync_info?.sync_saga_id)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Saga Status
                      </label>
                      <p className="text-sm text-gray-900 font-medium uppercase">
                        {displayValue(registration.sync_info?.saga_status)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        ERP Customer ID
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium">
                        {displayValue(registration.sync_info?.erp_customer_id)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        CRM Customer ID
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium">
                        {displayValue(registration.sync_info?.crm_customer_id)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Sync Last Error
                      </label>
                      <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 whitespace-pre-wrap">
                        {displayValue(registration.sync_info?.sync_last_error)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Sync Last Rollback Error
                      </label>
                      <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 whitespace-pre-wrap">
                        {displayValue(
                          registration.sync_info?.sync_last_rollback_error,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              {(registration.created_at || registration.updated_at) && (
                <section className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FaClock className="w-4 h-4 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Catatan Aktivitas
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {registration.created_at && (
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-5 border-2 border-green-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                            <FaUser className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Created
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {registration.created_by || "System"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-green-500" />
                          <p className="text-sm">
                            {new Date(registration.created_at).toLocaleString(
                              "id-ID",
                              {
                                dateStyle: "long",
                                timeStyle: "short",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {registration.updated_at && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border-2 border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <FaEdit className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Last Updated
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {registration.updated_by || "System"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-blue-500" />
                          <p className="text-sm">
                            {new Date(registration.updated_at).toLocaleString(
                              "id-ID",
                              {
                                dateStyle: "long",
                                timeStyle: "short",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
              <div className="mb-6">
                <ResourceHistory
                  key={`customer-register-history-${registration.id}`}
                  endpoint={API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER}
                  resourceId={registration.id}
                  token={token}
                  demoMode={demoMode}
                />
              </div>
            </div>

            <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all"
              >
                Close
              </button>

              {canManageRegistration && (
                <div className="flex gap-3">
                  <motion.button
                    data-tour={
                      demoMode ? "customer-register-edit-button" : undefined
                    }
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEditModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onReject?.(registration)}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <FaTimesCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </motion.button>

                  <motion.button
                    data-tour={
                      demoMode ? "customer-register-approve-button" : undefined
                    }
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onApprove?.(registration)}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <FaCheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </motion.button>
                </div>
              )}

              {registration.status === "approved" && registration.gp_name && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
                  <FaCheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Approved - GP: {registration.gp_name}
                  </span>
                </div>
              )}

              {normalizedStatus === "rejected" && rejectReason !== "-" && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
                  <FaTimesCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700 font-medium">
                    Rejected - {rejectReason}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditRegistrationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        registration={registration}
        demoMode={demoMode}
        onDemoSave={onDemoRegistrationChange}
        onSuccess={() => {
          setIsEditModalOpen(false);
          onEdit?.();
        }}
      />
    </>
  );
}
