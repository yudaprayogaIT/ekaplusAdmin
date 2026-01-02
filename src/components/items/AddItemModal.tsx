// src/components/items/AddItemModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaUpload,
  FaCheckCircle,
  FaBarcode,
  FaTag,
} from "react-icons/fa";
import Image from "next/image";
import { Item } from "./ItemList";
import { useAuth } from "@/contexts/AuthContext";
import {
  getQueryUrl,
  getResourceUrl,
  getAuthHeaders,
  getAuthHeadersFormData,
  API_CONFIG,
} from "@/config/api";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import UnsavedChangesDialog from "@/components/ui/UnsavedChangesDialog";

const UOM_OPTIONS = ["PCS", "MTR", "SET", "PSG", "LBR", "UNIT", "BOX"];

type Branch = {
  id: number;
  name: string;
  branch_name: string;
};

export default function AddItemModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Item | null;
}) {
  const { token } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [uom, setUom] = useState("PCS");
  const [group, setGroup] = useState("");
  const [category, setCategory] = useState("");
  const [generatorItem, setGeneratorItem] = useState("");
  const [imageUuid, setImageUuid] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [disabled, setDisabled] = useState(0);
  const [panjang, setPanjang] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [lebar, setLebar] = useState("");
  const [diameter, setDiameter] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  // Track initial state for dirty checking
  const [initialState, setInitialState] = useState({
    code: "",
    name: "",
    uom: "PCS",
    group: "",
    category: "",
    generatorItem: "",
    imageUuid: "",
    description: "",
    disabled: 0,
    panjang: "",
    tinggi: "",
    lebar: "",
    diameter: "",
    selectedBranches: [] as number[],
  });

  // Check if form is dirty
  const isDirty =
    code !== initialState.code ||
    name !== initialState.name ||
    uom !== initialState.uom ||
    group !== initialState.group ||
    category !== initialState.category ||
    generatorItem !== initialState.generatorItem ||
    imageUuid !== initialState.imageUuid ||
    description !== initialState.description ||
    disabled !== initialState.disabled ||
    panjang !== initialState.panjang ||
    tinggi !== initialState.tinggi ||
    lebar !== initialState.lebar ||
    diameter !== initialState.diameter ||
    JSON.stringify(selectedBranches) !==
      JSON.stringify(initialState.selectedBranches) ||
    imageFile !== null;

  // Unsaved changes hook
  const { showConfirm, handleClose, handleConfirmClose, handleCancelClose } =
    useUnsavedChanges({ isDirty, onClose });

  // Load branches from API
  useEffect(() => {
    if (!open || !token) return;

    async function loadBranches() {
      if (!token) return; // Guard for async function
      setLoadingBranches(true);
      try {
        const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, {
          fields: ["*"],
        });
        const headers = getAuthHeaders(token);

        const res = await fetch(DATA_URL, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = await res.json();
          const mappedBranches: Branch[] = response.data.map(
            (b: { id: number; branch_name: string }) => ({
              id: b.id,
              name: b.branch_name,
              branch_name: b.branch_name,
            })
          );
          console.log("=== LOADED BRANCHES FROM API ===");
          console.log("Branches:", mappedBranches);
          console.log(
            "Branch IDs:",
            mappedBranches.map((b) => b.id)
          );
          setBranches(mappedBranches);
        }
      } catch (error) {
        console.error("Failed to load branches:", error);
      } finally {
        setLoadingBranches(false);
      }
    }

    loadBranches();
  }, [open, token]);

  useEffect(() => {
    if (initial) {
      const imageUrl = initial.image ?? "";
      const imageUuidMatch = imageUrl.match(/\/files\/(.+)$/);
      const imageUuidExtracted = imageUuidMatch ? imageUuidMatch[1] : imageUrl;

      setCode(initial.code ?? "");
      setName(initial.name ?? "");
      setUom(initial.uom ?? "PCS");
      setGroup(initial.group ?? "");
      setCategory(initial.category ?? "");
      setGeneratorItem(initial.generator_item ?? "");
      setImageUuid(imageUuidExtracted);
      setImagePreview(initial.image || null);
      setImageFile(null);
      setDescription(initial.description ?? "");
      setDisabled(initial.disabled ?? 0);
      setPanjang(initial.panjang ?? "");
      setTinggi(initial.tinggi ?? "");
      setLebar(initial.lebar ?? "");
      setDiameter(initial.diameter ?? "");

      // Debug: Log branch data
      console.log("=== EDIT ITEM MODAL - BRANCH DEBUG ===");
      console.log("initial.branches:", initial.branches);
      const branchIds = initial.branches?.map((b) => b.id) ?? [];
      console.log("Extracted branch IDs:", branchIds);
      setSelectedBranches(branchIds);

      // Set initial state for dirty checking
      setInitialState({
        code: initial.code ?? "",
        name: initial.name ?? "",
        uom: initial.uom ?? "PCS",
        group: initial.group ?? "",
        category: initial.category ?? "",
        generatorItem: initial.generator_item ?? "",
        imageUuid: imageUuidExtracted,
        description: initial.description ?? "",
        disabled: initial.disabled ?? 0,
        panjang: initial.panjang ?? "",
        tinggi: initial.tinggi ?? "",
        lebar: initial.lebar ?? "",
        diameter: initial.diameter ?? "",
        selectedBranches: initial.branches?.map((b) => b.id) ?? [],
      });
    } else {
      setCode("");
      setName("");
      setUom("PCS");
      setGroup("");
      setCategory("");
      setGeneratorItem("");
      setImageUuid("");
      setImagePreview(null);
      setImageFile(null);
      setDescription("");
      setDisabled(0);
      setPanjang("");
      setTinggi("");
      setLebar("");
      setDiameter("");
      setSelectedBranches([]);

      // Set initial state for dirty checking
      setInitialState({
        code: "",
        name: "",
        uom: "PCS",
        group: "",
        category: "",
        generatorItem: "",
        imageUuid: "",
        description: "",
        disabled: 0,
        panjang: "",
        tinggi: "",
        lebar: "",
        diameter: "",
        selectedBranches: [],
      });
    }
  }, [initial, open]);

  // Image file preview
  useEffect(() => {
    if (!imageFile) return;
    const fr = new FileReader();
    fr.onload = () => {
      setImagePreview(String(fr.result));
    };
    fr.readAsDataURL(imageFile);
  }, [imageFile]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!saving) {
          const form = document.querySelector("form");
          if (form) {
            form.requestSubmit();
          }
        }
      }
      // Escape to cancel
      if (e.key === "Escape") {
        e.preventDefault();
        if (!saving) {
          handleClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, saving, handleClose]);

  function toggleBranch(branchId: number) {
    setSelectedBranches((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  }

  function selectAllBranches() {
    setSelectedBranches(branches.map((b) => b.id));
  }

  function deselectAllBranches() {
    setSelectedBranches([]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      alert("Not authenticated");
      return;
    }
    setSaving(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("item_code", code.trim());
      formData.append("item_name", name.trim());
      formData.append(
        "generator_item",
        generatorItem.trim() || "Inject by master"
      );
      formData.append("uom", uom);
      formData.append("item_group", group.trim());
      formData.append("item_category", category.trim());

      // Format branches untuk FormData
      selectedBranches.forEach((branchId, index) => {
        formData.append(`branches[${index}][branch]`, String(branchId));
      });

      formData.append("status", "Draft");
      formData.append("docstatus", "0");
      formData.append("disabled", String(disabled));

      // Optional fields
      if (description.trim()) {
        formData.append("item_desc", description.trim());
      }
      if (panjang.trim()) {
        formData.append("panjang", panjang.trim());
      }
      if (lebar.trim()) {
        formData.append("lebar", lebar.trim());
      }
      if (tinggi.trim()) {
        formData.append("tinggi", tinggi.trim());
      }
      if (diameter.trim()) {
        formData.append("diameter", diameter.trim());
      }

      // If new image file, send the file object
      // If no new file but has UUID, send the UUID string
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageUuid) {
        formData.append("image", imageUuid.trim());
      }

      const headers = getAuthHeadersFormData(token);
      const method = initial ? "PUT" : "POST";
      const url = initial
        ? getResourceUrl(API_CONFIG.ENDPOINTS.ITEM, initial.id)
        : getResourceUrl(API_CONFIG.ENDPOINTS.ITEM);

      console.log("Saving item with method:", method);
      console.log("URL:", url);
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await fetch(url, {
        method,
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        throw new Error(
          errorData.message || `Failed to save item (${response.status})`
        );
      }

      console.log("Item saved successfully");

      // Trigger reload
      window.dispatchEvent(new Event("ekatalog:items_update"));
      setSaving(false);
      onClose();
    } catch (error) {
      console.error("Failed to save item:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(`Gagal menyimpan item: ${errorMessage}`);
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />

              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {initial ? "Edit Item" : "Tambah Item Baru"}
                  </h3>
                  <p className="text-red-100 text-sm">
                    {initial
                      ? "Perbarui informasi item"
                      : "Lengkapi form untuk menambahkan item"}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={submit}
              className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto"
            >
              {/* Code & Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kode Item <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBarcode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="0010010000107"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Item <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="ACC BED BAUT SAKURA BESAR 5 CM"
                    required
                  />
                </div>
              </div>

              {/* UOM, Category & Group */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    UOM <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={uom}
                    onChange={(e) => setUom(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  >
                    {UOM_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Masukkan kategori"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Group <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="ACC BED BAUT SAKURA"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                  rows={3}
                  placeholder="Deskripsi produk..."
                />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Panjang
                  </label>
                  <input
                    value={panjang}
                    onChange={(e) => setPanjang(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="cm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lebar
                  </label>
                  <input
                    value={lebar}
                    onChange={(e) => setLebar(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="cm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tinggi
                  </label>
                  <input
                    value={tinggi}
                    onChange={(e) => setTinggi(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="cm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Diameter
                  </label>
                  <input
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="cm"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Gambar Produk
                </label>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 cursor-pointer transition-all group">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <FaUpload className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                        Upload Gambar
                      </span>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setImageFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </label>

                  {imagePreview && (
                    <div className="relative w-full h-48 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                        <FaCheckCircle className="w-4 h-4" />
                      </div>
                      <Image
                        src={imagePreview}
                        alt="preview"
                        width={1000}
                        height={1000}
                        className="object-contain w-full h-full p-3"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Branches Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Pilih Cabang
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAllBranches}
                      disabled={loadingBranches}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium disabled:opacity-50"
                    >
                      Pilih Semua
                    </button>
                    <button
                      type="button"
                      onClick={deselectAllBranches}
                      disabled={loadingBranches}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                    >
                      Hapus Semua
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  {loadingBranches ? (
                    <div className="col-span-full text-center py-8">
                      <div className="w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-xs text-gray-500">Memuat cabang...</p>
                    </div>
                  ) : branches.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <p className="text-xs text-gray-500">
                        Tidak ada cabang tersedia
                      </p>
                    </div>
                  ) : (
                    branches.map((branch) => {
                      const isChecked = selectedBranches.includes(branch.id);
                      // Debug first branch only to avoid spam
                      if (branch.id === branches[0]?.id) {
                        console.log(
                          `Rendering branch ${branch.id} (${branch.name}):`,
                          "isChecked:",
                          isChecked,
                          "selectedBranches:",
                          selectedBranches
                        );
                      }
                      return (
                        <label
                          key={branch.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                            isChecked
                              ? "bg-green-100 border-2 border-green-500"
                              : "bg-white border-2 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBranch(branch.id)}
                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                          />
                          <span className="text-xs font-medium text-gray-700">
                            {branch.name}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedBranches.length} cabang dipilih
                </p>
              </div>

              {/* Generator & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Generator Item
                  </label>
                  <input
                    value={generatorItem}
                    onChange={(e) => setGeneratorItem(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Inject by master"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={disabled}
                    onChange={(e) => setDisabled(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  >
                    <option value={0}>Aktif</option>
                    <option value={1}>Nonaktif</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{initial ? "Simpan Perubahan" : "Tambah Item"}</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Unsaved Changes Dialog */}
          <UnsavedChangesDialog
            open={showConfirm}
            onConfirm={handleConfirmClose}
            onCancel={handleCancelClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
