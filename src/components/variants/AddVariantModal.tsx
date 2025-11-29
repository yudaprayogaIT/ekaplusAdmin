// // src/components/variants/AddVariantModal.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaTimes, FaLink, FaBox } from "react-icons/fa";

// type Branch = {
//   id: number;
//   name: string;
// };

// type Item = {
//   id: number;
//   code: string;
//   name: string;
//   color: string;
//   type: string;
//   uom: string;
//   image?: string;
//   branches: Branch[];
//   description?: string;
// };

// type Product = {
//   id: number;
//   name: string;
// };

// type Variant = {
//   id?: number;
//   item: Item;
//   productid: number;
// };

// const SNAP_KEY = "ekatalog_variants_snapshot";

// export default function AddVariantModal({
//   open,
//   onClose,
//   initial,
//   products,
//   items,
// }: {
//   open: boolean;
//   onClose: () => void;
//   initial?: Variant | null;
//   products: Product[];
//   items: Item[];
// }) {
//   const [selectedItemId, setSelectedItemId] = useState<number>(0);
//   const [selectedProductId, setSelectedProductId] = useState<number>(0);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (initial) {
//       setSelectedItemId(initial.item.id);
//       setSelectedProductId(initial.productid);
//     } else {
//       setSelectedItemId(items[0]?.id || 0);
//       setSelectedProductId(products[0]?.id || 0);
//     }
//   }, [initial, open, items, products]);

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();

//     if (!selectedItemId || !selectedProductId) {
//       alert("Pilih item dan product!");
//       return;
//     }

//     setSaving(true);

//     const selectedItem = items.find((i) => i.id === selectedItemId);
//     if (!selectedItem) {
//       alert("Item tidak ditemukan!");
//       setSaving(false);
//       return;
//     }

//     const payload = {
//       item: selectedItem,
//       productid: selectedProductId,
//     };

//     try {
//       const raw = localStorage.getItem(SNAP_KEY);
//       let list: Variant[] = raw ? JSON.parse(raw) : [];

//       if (initial && initial.id) {
//         list = list.map((v) =>
//           v.id === initial.id ? { ...v, ...payload, id: initial.id } : v
//         );
//       } else {
//         const maxId = list.reduce(
//           (m: number, it: Variant) => Math.max(m, Number(it.id) || 0),
//           0
//         );
//         const newVariant: Variant = {
//           id: maxId + 1,
//           ...payload,
//         };
//         list.push(newVariant);
//       }

//       localStorage.setItem(SNAP_KEY, JSON.stringify(list));
//       window.dispatchEvent(new Event("ekatalog:variants_update"));
//     } catch (error) {
//       console.error("Failed to save variant:", error);
//     }

//     setSaving(false);
//     onClose();
//   }

//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center p-4"
//         >
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={onClose}
//           />

//           <motion.div
//             initial={{ scale: 0.9, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.9, opacity: 0, y: 20 }}
//             transition={{ type: "spring", duration: 0.3 }}
//             className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden z-10"
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white relative overflow-hidden">
//               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
//               <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />

//               <div className="relative flex items-center justify-between">
//                 <div>
//                   <h3 className="text-2xl font-bold mb-1">
//                     {initial
//                       ? "Edit Variant Mapping"
//                       : "Tambah Variant Mapping"}
//                   </h3>
//                   <p className="text-red-100 text-sm">
//                     {initial
//                       ? "Perbarui mapping variant"
//                       : "Hubungkan item dengan product"}
//                   </p>
//                 </div>
//                 <button
//                   onClick={onClose}
//                   className="p-2 hover:bg-white/20 rounded-xl transition-colors"
//                 >
//                   <FaTimes className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>

//             {/* Form */}
//             <form
//               onSubmit={submit}
//               className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto"
//             >
//               {/* Item Selection */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   <div className="flex items-center gap-2">
//                     <FaBox className="w-4 h-4 text-gray-500" />
//                     <span>
//                       Item <span className="text-red-500">*</span>
//                     </span>
//                   </div>
//                 </label>
//                 <select
//                   value={selectedItemId}
//                   onChange={(e) => setSelectedItemId(Number(e.target.value))}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
//                   required
//                 >
//                   <option value={0}>Pilih Item...</option>
//                   {items.map((item) => (
//                     <option key={item.id} value={item.id}>
//                       {item.name} ({item.code})
//                     </option>
//                   ))}
//                 </select>
//                 {selectedItemId > 0 && (
//                   <div className="mt-3 p-3 bg-gray-50 rounded-lg">
//                     <p className="text-sm text-gray-600">
//                       {items.find((i) => i.id === selectedItemId)
//                         ?.description || "No description"}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Product Selection */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   <div className="flex items-center gap-2">
//                     <FaLink className="w-4 h-4 text-blue-500" />
//                     <span>
//                       Product <span className="text-red-500">*</span>
//                     </span>
//                   </div>
//                 </label>
//                 <select
//                   value={selectedProductId}
//                   onChange={(e) => setSelectedProductId(Number(e.target.value))}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
//                   required
//                 >
//                   <option value={0}>Pilih Product...</option>
//                   {products.map((product) => (
//                     <option key={product.id} value={product.id}>
//                       {product.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Preview */}
//               {selectedItemId > 0 && selectedProductId > 0 && (
//                 <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
//                   <div className="flex items-center gap-2 mb-2">
//                     <FaLink className="w-4 h-4 text-blue-600" />
//                     <span className="text-sm font-bold text-blue-900">
//                       Mapping Preview
//                     </span>
//                   </div>
//                   <div className="text-sm text-blue-800">
//                     <span className="font-semibold">
//                       {items.find((i) => i.id === selectedItemId)?.name}
//                     </span>
//                     {" → "}
//                     <span className="font-semibold">
//                       {products.find((p) => p.id === selectedProductId)?.name}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700"
//                 >
//                   Batal
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving || !selectedItemId || !selectedProductId}
//                   className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   {saving ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       <span>Menyimpan...</span>
//                     </>
//                   ) : (
//                     <span>
//                       {initial ? "Simpan Perubahan" : "Tambah Mapping"}
//                     </span>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
