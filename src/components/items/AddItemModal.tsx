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

type Item = {
  id?: number;
  code: string;
  name: string;
  uom: string;
  group: string;
  category: {
    id: number;
    name: string;
  };
  generator_item: string;
  image: string;
  description: string;
  disabled: number;
  panjang?: string;
  tinggi?: string;
  lebar?: string;
  diameter?: string;
  branches: Array<{
    id: number;
    name: string;
  }>;
};

type Category = {
  id: number;
  name: string;
};

const SNAP_KEY = "ekatalog_items_snapshot";
const UOM_OPTIONS = ["PCS", "MTR", "SET", "PSG", "LBR", "UNIT", "BOX"];

// Mock branches - ideally load from API/localStorage
const AVAILABLE_BRANCHES = [
  { id: 1, name: "Ekatunggal Tunas Medan" },
  { id: 2, name: "Ekatunggal Tunas Melaju" },
  { id: 3, name: "Ekatunggal Tunas Musi" },
  { id: 4, name: "Ekatunggal Tunas Mandiri" },
  { id: 5, name: "Ekatunggal Tri Mandiri" },
  { id: 6, name: "Ekatunggal Tumbuh Mandiri" },
  { id: 7, name: "Ekatunggal" },
  { id: 8, name: "Ekatunggal Tunas Malindo" },
  { id: 9, name: "Ekatunggal Samarinda Mahakam" },
  { id: 10, name: "Ekatunggal Timur Manado" },
  { id: 11, name: "Ekatunggal Timur Makassar" },
  { id: 12, name: "Ekatunggal Timur Manisa" },
  { id: 13, name: "Ekatunggal Timur Maroso" },
];

export default function AddItemModal({
  open,
  onClose,
  initial,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Item | null;
  categories: Category[];
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [uom, setUom] = useState("PCS");
  const [group, setGroup] = useState("");
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  const [generatorItem, setGeneratorItem] = useState("");
  const [imagePath, setImagePath] = useState("");
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

  useEffect(() => {
    if (initial) {
      setCode(initial.code ?? "");
      setName(initial.name ?? "");
      setUom(initial.uom ?? "PCS");
      setGroup(initial.group ?? "");
      setCategoryId(initial.category?.id ?? (categories[0]?.id || 1));
      setGeneratorItem(initial.generator_item ?? "");
      setImagePath(initial.image ?? "");
      setImagePreview(initial.image ?? null);
      setDescription(initial.description ?? "");
      setDisabled(initial.disabled ?? 0);
      setPanjang(initial.panjang ?? "");
      setTinggi(initial.tinggi ?? "");
      setLebar(initial.lebar ?? "");
      setDiameter(initial.diameter ?? "");
      setSelectedBranches(initial.branches?.map((b) => b.id) ?? []);
      setImageFile(null);
    } else {
      setCode("");
      setName("");
      setUom("PCS");
      setGroup("");
      setCategoryId(categories[0]?.id || 1);
      setGeneratorItem("Inject by master");
      setImagePath("");
      setImagePreview(null);
      setDescription("");
      setDisabled(0);
      setPanjang("");
      setTinggi("");
      setLebar("");
      setDiameter("");
      setSelectedBranches([]);
      setImageFile(null);
    }
  }, [initial, open, categories]);

  // Image file preview
  useEffect(() => {
    if (!imageFile) return;
    const fr = new FileReader();
    fr.onload = () => {
      setImagePreview(String(fr.result));
      setImagePath(String(fr.result));
    };
    fr.readAsDataURL(imageFile);
  }, [imageFile]);

  function toggleBranch(branchId: number) {
    setSelectedBranches((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  }

  function selectAllBranches() {
    setSelectedBranches(AVAILABLE_BRANCHES.map((b) => b.id));
  }

  function deselectAllBranches() {
    setSelectedBranches([]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const selectedCategory = categories.find((c) => c.id === categoryId);
    const branches = AVAILABLE_BRANCHES.filter((b) =>
      selectedBranches.includes(b.id)
    );

    const payload: Omit<Item, "id"> = {
      code: code.trim(),
      name: name.trim(),
      uom,
      group: group.trim(),
      category: {
        id: categoryId,
        name: selectedCategory?.name || "",
      },
      generator_item: generatorItem.trim() || "Inject by master",
      image: imagePath || "",
      description: description.trim(),
      disabled,
      panjang: panjang.trim(),
      tinggi: tinggi.trim(),
      lebar: lebar.trim(),
      diameter: diameter.trim(),
      branches,
    };

    try {
      const raw = localStorage.getItem(SNAP_KEY);
      let list: Item[] = raw ? JSON.parse(raw) : [];

      if (initial && initial.id) {
        list = list.map((item) =>
          item.id === initial.id
            ? { ...item, ...payload, id: initial.id }
            : item
        );
      } else {
        const maxId = list.reduce(
          (m: number, it: Item) => Math.max(m, Number(it.id) || 0),
          0
        );
        const newItem: Item = {
          id: maxId + 1,
          ...payload,
        };
        list.push(newItem);
      }

      localStorage.setItem(SNAP_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("ekatalog:items_update"));
    } catch (error) {
      console.error("Failed to save item:", error);
    }

    setSaving(false);
    onClose();
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
            onClick={onClose}
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
                  onClick={onClose}
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
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="object-contain w-full h-full p-3"
                      />
                    </div>
                  )}

                  <input
                    value={imagePath}
                    onChange={(e) => {
                      setImagePath(e.target.value);
                      setImagePreview(e.target.value || null);
                    }}
                    placeholder="atau path: /images/items/..."
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                  />
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
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                    >
                      Pilih Semua
                    </button>
                    <button
                      type="button"
                      onClick={deselectAllBranches}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Hapus Semua
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  {AVAILABLE_BRANCHES.map((branch) => (
                    <label
                      key={branch.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        selectedBranches.includes(branch.id)
                          ? "bg-green-100 border-2 border-green-500"
                          : "bg-white border-2 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBranches.includes(branch.id)}
                        onChange={() => toggleBranch(branch.id)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {branch.name}
                      </span>
                    </label>
                  ))}
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
                  onClick={onClose}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
