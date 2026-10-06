"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaImage,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaTag,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import { Item } from "./ItemList";
import {
  API_CONFIG,
  apiFetch,
  getAuthHeaders,
  getFileUrl,
  getQueryUrl,
} from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

type Branch = { id: number; name: string };

type Variant = {
  id: number | string;
  idx: number;
  parent_id: number | string;
  product_name?: string;
};

type ItemDetailModalProps = {
  open: boolean;
  onClose: () => void;
  item?: Item | null;
};

function displayValue(value: unknown) {
  return value === null || value === undefined || value === ""
    ? "-"
    : String(value);
}

function InfoCell({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="min-w-0 border-b border-slate-100 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>
      <p
        className="mt-1.5 truncate text-sm font-bold text-slate-900"
        title={displayValue(value)}
      >
        {displayValue(value)}
      </p>
    </div>
  );
}

function SectionTitle({
  icon,
  children,
  count,
}: {
  icon: ReactNode;
  children: ReactNode;
  count?: number;
}) {
  return (
    <div className="mb-3 flex items-center gap-2.5 border-b border-slate-100 pb-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-sm text-rose-500">
        {icon}
      </span>
      <h3 className="text-sm font-bold text-slate-900 sm:text-base">
        {children}
      </h3>
      {count !== undefined && (
        <span className="ml-auto rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
          {count} data
        </span>
      )}
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatSyncDate(value?: string) {
  if (!value) return "Belum pernah";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ItemImagePreview({
  item,
  token,
}: {
  item: Item;
  token?: string | null;
}) {
  const imageUrl = getFileUrl(item.image);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function loadImage() {
      if (!imageUrl) {
        setBlobUrl(null);
        setError(null);
        return;
      }

      if (!token) {
        setBlobUrl(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch(
          imageUrl,
          { method: "GET", cache: "no-store" },
          token,
        );
        if (!response.ok) {
          throw new Error(`Gagal memuat gambar (${response.status})`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) setBlobUrl(objectUrl);
      } catch (loadError) {
        if (!cancelled) {
          setBlobUrl(null);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat gambar item",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadImage();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageUrl, token]);

  const previewUrl = blobUrl || imageUrl || "";
  const fileName = imageUrl
    ? decodeURIComponent(imageUrl.split("/").pop() || "Gambar item")
    : "Belum ada gambar";

  return (
    <aside className="w-full self-start rounded-xl border border-slate-200 bg-slate-50/50 p-4 md:sticky md:top-0">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-800">
          <FaImage className="text-slate-400" />
          <span>Gambar Item</span>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
            imageUrl
              ? "border-emerald-100 bg-emerald-50 text-emerald-600"
              : "border-slate-200 bg-slate-100 text-slate-500"
          }`}
        >
          {imageUrl ? "File tersedia" : "Tanpa gambar"}
        </span>
      </div>

      {loading ? (
        <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-400">
          Memuat gambar...
        </div>
      ) : error ? (
        <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-red-100 bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      ) : previewUrl ? (
        <button
          type="button"
          onClick={() => {
            setPreviewOpen(true);
            setZoomed(false);
            setZoomOrigin({ x: 50, y: 50 });
          }}
          className="group block w-full overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-rose-300"
        >
          <div className="relative aspect-square w-full overflow-hidden bg-white">
            <Image
              src={previewUrl}
              alt={item.name}
              fill
              unoptimized
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        </button>
      ) : (
        <div className="flex aspect-square w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400">
          <FaImage className="mb-3 h-10 w-10 text-slate-300" />
          <span className="text-sm">Gambar belum tersedia</span>
        </div>
      )}

      <p className="mt-3 truncate text-[11px] text-slate-400" title={fileName}>
        {fileName}
      </p>
      {previewUrl && !loading && !error && (
        <p className="mt-1 text-xs text-slate-500">
          Klik gambar untuk memperbesar.
        </p>
      )}

      <AnimatePresence>
        {previewOpen && previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-100/90 p-4 backdrop-blur-sm"
            onClick={(event) =>
              event.target === event.currentTarget
                ? setPreviewOpen(false)
                : undefined
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => {
                  setPreviewOpen(false);
                  setZoomed(false);
                  setZoomOrigin({ x: 50, y: 50 });
                }}
                className="absolute right-4 top-4 z-10 rounded-xl bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white"
                aria-label="Tutup preview gambar"
              >
                <FaTimes className="h-5 w-5" />
              </button>
              <div
                className={`relative h-[80vh] w-full overflow-hidden bg-slate-100 ${
                  zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onDoubleClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = ((event.clientX - rect.left) / rect.width) * 100;
                  const y = ((event.clientY - rect.top) / rect.height) * 100;
                  setZoomOrigin({ x, y });
                  setZoomed((current) => !current);
                }}
                onMouseMove={(event) => {
                  if (!zoomed) return;
                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = ((event.clientX - rect.left) / rect.width) * 100;
                  const y = ((event.clientY - rect.top) / rect.height) * 100;
                  setZoomOrigin({
                    x: Math.min(100, Math.max(0, x)),
                    y: Math.min(100, Math.max(0, y)),
                  });
                }}
              >
                <Image
                  src={previewUrl}
                  alt={item.name}
                  fill
                  unoptimized
                  className={`object-contain transition-transform duration-200 ${
                    zoomed ? "scale-[1.8]" : "scale-100"
                  }`}
                  style={{
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  }}
                />
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-center text-xs font-medium text-slate-600 shadow-sm">
                  {zoomed
                    ? "Arahkan mouse ke area yang ingin dilihat, double click untuk reset zoom."
                    : "Double click untuk zoom."}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

export default function ItemDetailModal({
  open,
  onClose,
  item,
}: ItemDetailModalProps) {
  const { token } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);

  useEffect(() => {
    setBranches(item?.branches || []);
    setLoadingBranches(false);

    if (!open || !token || !item?.branches?.length) return;

    const authToken = token;
    const itemBranches = item.branches;
    let cancelled = false;
    async function loadBranchNames() {
      setLoadingBranches(true);
      try {
        const response = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, {
            fields: ["id", "branch_name"],
          }),
          {
            method: "GET",
            cache: "no-store",
            headers: getAuthHeaders(authToken),
          },
        );
        if (!response.ok) return;

        const json = await response.json();
        const names = new Map<number, string>(
          (json.data || []).map(
            (branch: { id: number; branch_name: string }) => [
              branch.id,
              branch.branch_name,
            ],
          ),
        );
        if (!cancelled) {
          setBranches(
            itemBranches.map((branch) => ({
              ...branch,
              name: names.get(branch.id) || branch.name,
            })),
          );
        }
      } finally {
        if (!cancelled) setLoadingBranches(false);
      }
    }

    void loadBranchNames();
    return () => {
      cancelled = true;
    };
  }, [item, open, token]);

  useEffect(() => {
    setVariants([]);
    setLoadingVariants(false);
    if (!open || !token || !item) return;

    const authToken = token;
    const currentItem = item;
    let cancelled = false;
    async function loadProducts() {
      setLoadingVariants(true);
      try {
        const headers = getAuthHeaders(authToken);
        const response = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, {
            fields: ["id"],
            filters: [["id", "=", currentItem.id]],
            childs: [
              {
                alias: "variants",
                table: "ekatalog_variant",
                fields: ["id", "idx", "parent_id"],
                parent_key: "item",
                parent_value: "id",
              },
            ],
          }),
          { method: "GET", cache: "no-store", headers },
        );
        if (!response.ok) return;

        const json = await response.json();
        const itemRow = Array.isArray(json.data) ? json.data[0] : json.data;
        const rows: Variant[] = itemRow?.variants || [];
        if (rows.length === 0) return;

        // API dapat mengembalikan ID sebagai number atau string. Map memakai
        // strict equality, sedangkan React mengubah keduanya menjadi key string.
        // Normalisasi mencegah produk 123 dan "123" dianggap dua data berbeda.
        const productsByKey = new Map<string, number | string>();
        rows.forEach((row) => {
          if (row.parent_id !== null && row.parent_id !== undefined) {
            productsByKey.set(String(row.parent_id), row.parent_id);
          }
        });
        const productIds = [...productsByKey.values()];
        if (productIds.length === 0) return;

        const productsResponse = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT, {
            fields: ["id", "product_name"],
            filters: [["id", "in", productIds]],
          }),
          { method: "GET", cache: "no-store", headers },
        );

        const productNames = new Map<string, string>();
        if (productsResponse.ok) {
          const productsJson = await productsResponse.json();
          (productsJson.data || []).forEach(
            (product: { id: number | string; product_name: string }) => {
              productNames.set(String(product.id), product.product_name);
            },
          );
        }

        const uniqueProducts = new Map<string, Variant>();
        rows.forEach((row) => {
          if (row.parent_id === null || row.parent_id === undefined) return;
          const productKey = String(row.parent_id);
          if (!uniqueProducts.has(productKey)) {
            uniqueProducts.set(productKey, {
              ...row,
              product_name:
                productNames.get(productKey) || `Produk #${row.parent_id}`,
            });
          }
        });
        if (!cancelled) setVariants([...uniqueProducts.values()]);
      } finally {
        if (!cancelled) setLoadingVariants(false);
      }
    }

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, [item, open, token]);

  if (!item) return null;

  const dimensions = [
    ["Panjang", item.length ?? item.panjang, "CM"],
    ["Lebar", item.width ?? item.lebar, "CM"],
    ["Tinggi", item.height ?? item.tinggi, "CM"],
    ["Berat Bersih", item.weight, "KG"],
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Tutup detail"
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 12 }}
            className="relative z-10 flex h-[96dvh] w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl sm:h-[min(94vh,820px)] sm:w-[94%] sm:rounded-xl lg:w-[90%] lg:max-w-[1400px]"
          >
            <header className="flex shrink-0 items-start gap-3 bg-gradient-to-r from-rose-600 to-red-700 px-4 py-5 text-white sm:px-6">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <code className="rounded bg-white/20 px-2.5 py-1 text-[11px] font-extrabold shadow-sm sm:text-xs">
                    {displayValue(item.code)}
                  </code>
                  {/* {item.subcategory && (
                    <span className="rounded bg-white/20 px-2.5 py-1 text-[11px] font-extrabold uppercase shadow-sm sm:text-xs">
                      {item.subcategory}
                    </span>
                  )} */}
                  {/* <span className="rounded bg-white/20 px-2.5 py-1 text-[11px] font-extrabold uppercase shadow-sm sm:text-xs">
                    {displayValue(item.uom)}
                  </span> */}
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold sm:text-xs ${
                      item.disabled === 0 ? "bg-emerald-500" : "bg-gray-500"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {item.status}
                  </span>
                </div>
                <h2
                  className="line-clamp-2 text-xl font-extrabold tracking-tight sm:text-[28px] sm:leading-tight"
                  title={item.name}
                >
                  {item.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-red-50 sm:text-xs">
                  {/* <span className="flex max-w-[320px] items-center gap-1.5 rounded bg-red-950/25 px-2 py-1">
                    <FaBarcode className="shrink-0" />
                    <code className="truncate">{item.code}</code>
                  </span>
                  <span>•</span> */}
                  <span>ID Item: #{item.id}</span>
                  <span>•</span>
                  <span>Versi{displayValue(item.version)}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-white/15"
                aria-label="Tutup"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto bg-white p-3 sm:p-5 lg:p-6">
              <div className="grid items-start gap-5 md:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
                <ItemImagePreview item={item} token={token} />

                <main className="min-w-0 space-y-4">
                  <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-2 flex items-start gap-2.5 border-b border-slate-100 pb-3">
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-sm text-rose-500">
                        <FaTag />
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                          Informasi Item
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                          Konfigurasi atribut teknis dan status dokumen
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 min-[430px]:grid-cols-2 sm:grid-cols-3 lg:gap-x-8">
                      {/* <InfoCell label="Item Name" value={item.item_name} />
                      <InfoCell label="Item Code" value={item.item_code} /> */}
                      <InfoCell label="Grup" value={item.group} />
                      <InfoCell label="Kategori" value={item.category} />
                      <InfoCell label="Subkategori" value={item.subcategory} />
                      <InfoCell label="UOM" value={item.uom} />
                      <div className="min-w-0 border-b border-slate-100 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                          Generator
                        </p>
                        <code className="mt-1.5 inline-block max-w-full truncate rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                          {displayValue(item.generator_item)}
                        </code>
                      </div>
                      <div className="min-w-0 border-b border-slate-100 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                          Last Item Updater
                        </p>
                        <code className="mt-1.5 inline-block max-w-full truncate rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                          {displayValue(item.last_item_updater)}
                        </code>
                      </div>
                      {/* <div className="min-w-0 border-b border-slate-100 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                          Status Item
                        </p>
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-900">
                          <span
                            className={`h-2 w-2 rounded-full ${item.disabled === 0 ? "bg-emerald-500" : "bg-slate-400"}`}
                          />
                          {item.status}
                        </p>
                      </div> */}
                      {/* <div className="min-w-0 border-b border-slate-100 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                          Docstatus
                        </p>
                        <p className="mt-1.5 text-sm font-bold text-slate-900">
                          {item.docstatus}{" "}
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-600">
                            {item.docstatus === 1 ? "Approved" : "Draft"}
                          </span>
                        </p>
                      </div>
                      <InfoCell label="Purchasing" value={item.purchasing} /> */}
                      <InfoCell
                        label="Standard Colly Item"
                        value={item.standard_colly_item}
                      />
                      <InfoCell label="NAma Item PPN" value={item.ppn_name} />
                      <InfoCell label="UOM PPN" value={item.uom_ppn} />
                      {/* <InfoCell
                        label="Akun Beban"
                        value={item.default_expense_account}
                      />
                      <InfoCell
                        label="Akun Pendapatan"
                        value={item.default_income_account}
                      /> */}
                    </div>
                  </section>

                  <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-4 flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-sm text-rose-500">
                        <FaRulerCombined />
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                          Dimensi &amp; Spesifikasi Fisik
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                          Ukuran volumetrik untuk penanganan logistik dan
                          pengiriman
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 rounded-xl border border-slate-100 bg-slate-50/60 sm:grid-cols-4 sm:divide-x sm:divide-slate-100">
                      {dimensions.map(([label, value, unit], index) => (
                        <div
                          key={String(label)}
                          className={`border-b border-slate-100 px-4 py-4 sm:border-b-0 ${index === 3 ? "text-rose-600" : "text-slate-900"}`}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                            {label}
                          </p>
                          <p className="mt-2 text-xl font-extrabold leading-none sm:text-2xl">
                            {displayValue(value)}{" "}
                            <span className="text-[11px] font-bold">
                              {value === null ||
                              value === undefined ||
                              value === ""
                                ? ""
                                : unit}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                    {item.description && (
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Deskripsi
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </section>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <section className="rounded-xl border border-gray-200 p-4">
                      <SectionTitle
                        icon={<FaMapMarkerAlt />}
                        count={branches.length}
                      >
                        Item Branches
                      </SectionTitle>
                      {loadingBranches && branches.length === 0 ? (
                        <p className="py-6 text-center text-sm text-gray-400">
                          Memuat cabang...
                        </p>
                      ) : branches.length > 0 ? (
                        <div className="grid max-h-48 grid-cols-1 gap-2 overflow-y-auto pr-1 xl:grid-cols-2">
                          {branches.map((branch) => (
                            <div
                              key={branch.id}
                              className="flex min-w-0 items-center gap-2.5 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-800"
                            >
                              <FaCheckCircle className="shrink-0 text-emerald-500" />
                              <span className="truncate" title={branch.name}>
                                {branch.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-lg bg-gray-50 py-6 text-center text-sm text-gray-400">
                          Belum tersedia di cabang
                        </p>
                      )}
                    </section>

                    <section className="rounded-xl border border-gray-200 p-4">
                      <SectionTitle icon={<FaBox />} count={variants.length}>
                        Terdaftar di Produk
                      </SectionTitle>
                      {loadingVariants ? (
                        <p className="py-6 text-center text-sm text-gray-400">
                          Memuat produk...
                        </p>
                      ) : variants.length > 0 ? (
                        <div className="grid max-h-48 grid-cols-1 gap-2 overflow-y-auto pr-1 xl:grid-cols-2">
                          {variants.map((variant) => (
                            <div
                              key={`product-${String(variant.parent_id)}`}
                              className="flex min-w-0 items-center gap-2.5 rounded-lg bg-blue-50 px-3 py-2.5"
                            >
                              <FaBox className="shrink-0 text-xs text-blue-500" />
                              <div className="min-w-0">
                                <p
                                  className="truncate text-sm font-semibold text-blue-900"
                                  title={variant.product_name}
                                >
                                  {variant.product_name}
                                </p>
                                <p className="text-xs text-blue-600">
                                  Urutan {variant.idx}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-lg bg-gray-50 py-6 text-center text-sm text-gray-400">
                          Belum terdaftar di produk
                        </p>
                      )}
                    </section>
                  </div>

                  <section className="rounded-xl border border-gray-200 p-4">
                    <SectionTitle icon={<FaClock />}>
                      Catatan Aktivitas
                    </SectionTitle>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <InfoCell
                        label="Dibuat oleh"
                        value={item.igen_created_by || item.created_by}
                      />
                      <InfoCell
                        label="Dibuat pada"
                        value={formatDate(item.created_at)}
                      />
                      <InfoCell
                        label="Diperbarui oleh"
                        value={
                          item.igen_updated_by ||
                          item.last_item_updater ||
                          item.updated_by
                        }
                      />
                      <InfoCell
                        label="Diperbarui pada"
                        value={formatDate(item.updated_at)}
                      />
                    </div>
                  </section>
                </main>
              </div>
            </div>

            <footer className="flex shrink-0 flex-wrap items-center gap-2 border-t border-slate-200 bg-slate-50/80 px-3 py-3 sm:px-6">
              <div className="mr-auto flex w-full min-w-0 items-center gap-2 text-[11px] text-slate-400 sm:w-auto sm:text-xs">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="truncate">
                  Terakhir disinkronisasi:{" "}
                  <strong className="text-slate-600">
                    {formatSyncDate(item.updated_at)} WIB
                  </strong>
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:flex-none sm:text-sm"
              >
                Tutup
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
