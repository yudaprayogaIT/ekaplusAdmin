// // src/components/products/ItemSelector.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaTimes, FaSearch, FaCheck, FaBox } from "react-icons/fa";
// import Image from "next/image";

// type Item = {
//   id: number;
//   code: string;
//   name: string;
//   color: string;
//   type: string;
//   image?: string;
//   description?: string;
// };

// type ItemSelectorProps = {
//   open: boolean;
//   onClose: () => void;
//   onSelect: (items: Item[]) => void;
//   selectedIds: number[];
//   availableItems: Item[];
// };

// export default function ItemSelector({
//   open,
//   onClose,
//   onSelect,
//   selectedIds,
//   availableItems,
// }: ItemSelectorProps) {
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<number[]>(selectedIds);

//   useEffect(() => {
//     setSelected(selectedIds);
//   }, [selectedIds, open]);

//   const filteredItems = availableItems.filter(
//     (item) =>
//       item.name.toLowerCase().includes(search.toLowerCase()) ||
//       item.code.toLowerCase().includes(search.toLowerCase()) ||
//       item.color?.toLowerCase().includes(search.toLowerCase()) ||
//       item.type?.toLowerCase().includes(search.toLowerCase())
//   );

//   const toggleItem = (id: number) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const handleConfirm = () => {
//     const selectedItems = availableItems.filter((item) =>
//       selected.includes(item.id)
//     );
//     onSelect(selectedItems);
//     onClose();
//   };

//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-[60] flex items-center justify-center p-4"
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
//             className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10 flex flex-col"
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white relative overflow-hidden flex-shrink-0">
//               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
//               <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />

//               <div className="relative flex items-center justify-between">
//                 <div>
//                   <h3 className="text-2xl font-bold mb-1">Pilih Item Varian</h3>
//                   <p className="text-red-100 text-sm">
//                     Pilih item yang akan menjadi varian dari produk ini
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

//             {/* Search */}
//             <div className="p-6 border-b border-gray-100 flex-shrink-0">
//               <div className="relative">
//                 <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Cari berdasarkan nama, kode, warna, atau tipe..."
//                   className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                 />
//               </div>
//               {selected.length > 0 && (
//                 <div className="mt-3 flex items-center gap-2">
//                   <span className="text-sm font-medium text-gray-700">
//                     {selected.length} item dipilih
//                   </span>
//                   <button
//                     onClick={() => setSelected([])}
//                     className="text-sm text-red-600 hover:text-red-700 font-medium"
//                   >
//                     Hapus semua
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Items List */}
//             <div className="flex-1 overflow-y-auto p-6">
//               {filteredItems.length === 0 ? (
//                 <div className="text-center py-12">
//                   <FaSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-gray-500">Tidak ada item ditemukan</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {filteredItems.map((item) => {
//                     const isSelected = selected.includes(item.id);
//                     return (
//                       <motion.div
//                         key={item.id}
//                         whileHover={{ scale: 1.02 }}
//                         onClick={() => toggleItem(item.id)}
//                         className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
//                           isSelected
//                             ? "border-red-500 bg-red-50"
//                             : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
//                         }`}
//                       >
//                         {/* Checkbox */}
//                         <div className="absolute top-3 right-3">
//                           <div
//                             className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
//                               isSelected
//                                 ? "bg-red-500 border-red-500"
//                                 : "border-gray-300 bg-white"
//                             }`}
//                           >
//                             {isSelected && (
//                               <FaCheck className="w-3.5 h-3.5 text-white" />
//                             )}
//                           </div>
//                         </div>

//                         <div className="flex gap-4 pr-8">
//                           {/* Image */}
//                           <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
//                             {item.image ? (
//                               <Image
//                                 width={80}
//                                 height={80}
//                                 src={item.image}
//                                 alt={item.name}
//                                 className="object-contain w-full h-full p-2"
//                               />
//                             ) : (
//                               <div className="w-full h-full flex items-center justify-center">
//                                 <FaBox className="w-8 h-8 text-gray-300" />
//                               </div>
//                             )}
//                           </div>

//                           {/* Info */}
//                           <div className="flex-1 min-w-0">
//                             <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
//                               {item.name}
//                             </h4>
//                             <p className="text-xs text-gray-500 mb-2">
//                               {item.code}
//                             </p>
//                             <div className="flex flex-wrap gap-1.5">
//                               {item.color && (
//                                 <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
//                                   {item.color}
//                                 </span>
//                               )}
//                               {item.type && (
//                                 <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
//                                   {item.type}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="p-6 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
//               <button
//                 onClick={onClose}
//                 className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700"
//               >
//                 Batal
//               </button>
//               <button
//                 onClick={handleConfirm}
//                 disabled={selected.length === 0}
//                 className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Pilih {selected.length > 0 && `(${selected.length})`}
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
