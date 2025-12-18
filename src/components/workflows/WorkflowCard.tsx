// // src/components/workflows/WorkflowCard.tsx
// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import {
//   FaEdit,
//   FaTrash,
//   FaProjectDiagram,
//   FaCircle,
//   FaArrowRight,
//   FaCheckCircle,
//   FaTimesCircle,
// } from "react-icons/fa";

// // Define types locally to avoid circular import
// type Workflow = {
//   id: string;
//   name: string;
//   display_name: string;
//   description: string;
//   document_type: string;
//   is_active: boolean;
//   initial_state: string;
//   color: string;
//   is_system?: boolean;
// };

// type WorkflowState = {
//   id: string;
//   workflow_id: string;
//   name: string;
//   display_name: string;
//   description: string;
//   color: string;
//   sequence: number;
//   is_initial: boolean;
//   is_final: boolean;
// };

// type WorkflowCardProps = {
//   workflow: Workflow;
//   states: WorkflowState[];
//   transitionCount: number;
//   onEdit?: () => void;
//   onDelete?: () => void;
//   onView?: () => void;
// };

// function WorkflowCard({
//   workflow,
//   states,
//   transitionCount,
//   onEdit,
//   onDelete,
//   onView,
// }: WorkflowCardProps) {
//   const initialState = states.find(s => s.is_initial);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{
//         y: -6,
//         boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
//       }}
//       onClick={() => onView?.()}
//       className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all group"
//     >
//       {/* Header with Color */}
//       <div
//         className="h-20 relative overflow-hidden"
//         style={{ backgroundColor: workflow.color }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
//         <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
//         <div className="absolute -top-4 -left-4 w-16 h-16 bg-black/10 rounded-full" />

//         {/* Status Badge */}
//         <div className="absolute top-3 right-3">
//           <span className={`px-3 py-1.5 backdrop-blur-sm rounded-full text-xs font-bold flex items-center gap-1 ${
//             workflow.is_active
//               ? 'bg-green-500/90 text-white'
//               : 'bg-gray-500/90 text-white'
//           }`}>
//             {workflow.is_active ? (
//               <>
//                 <FaCheckCircle className="w-3 h-3" />
//                 Active
//               </>
//             ) : (
//               <>
//                 <FaTimesCircle className="w-3 h-3" />
//                 Inactive
//               </>
//             )}
//           </span>
//         </div>

//         {/* Document Type Badge */}
//         <div className="absolute top-3 left-3">
//           <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 capitalize">
//             {workflow.document_type}
//           </span>
//         </div>
//       </div>

//       {/* Icon */}
//       <div className="relative -mt-8 px-5">
//         <div
//           className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-white"
//           style={{ backgroundColor: workflow.color }}
//         >
//           <FaProjectDiagram className="w-7 h-7" />
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-5 pt-3">
//         <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-red-600 transition-colors">
//           {workflow.display_name}
//         </h3>
//         <p className="text-sm text-gray-500 mb-4 line-clamp-2">
//           {workflow.description}
//         </p>

//         {/* Stats */}
//         <div className="flex items-center gap-3 mb-4">
//           <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
//             <FaCircle className="w-3 h-3 text-purple-500" />
//             <span className="text-sm font-semibold text-gray-700">
//               {states.length} States
//             </span>
//           </div>
//           <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
//             <FaArrowRight className="w-3 h-3 text-orange-500" />
//             <span className="text-sm font-semibold text-gray-700">
//               {transitionCount} Transitions
//             </span>
//           </div>
//         </div>

//         {/* State Flow Preview */}
//         <div className="mb-4 p-3 bg-gray-50 rounded-xl">
//           <div className="text-xs font-semibold text-gray-500 mb-2">State Flow:</div>
//           <div className="flex items-center gap-1 overflow-x-auto">
//             {states.slice(0, 4).map((state, idx) => (
//               <React.Fragment key={state.id}>
//                 <span
//                   className="px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
//                   style={{ backgroundColor: state.color }}
//                 >
//                   {state.display_name.length > 10
//                     ? state.display_name.substring(0, 10) + '...'
//                     : state.display_name
//                   }
//                 </span>
//                 {idx < Math.min(states.length - 1, 3) && (
//                   <FaArrowRight className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
//                 )}
//               </React.Fragment>
//             ))}
//             {states.length > 4 && (
//               <span className="text-xs text-gray-500 ml-1">+{states.length - 4}</span>
//             )}
//           </div>
//         </div>

//         {/* System Name */}
//         <div className="flex items-center justify-between mb-4">
//           <code className="text-xs text-gray-400 font-mono">
//             {workflow.name}
//           </code>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-2 pt-4 border-t border-gray-100">
//           <motion.button
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//             onClick={(e) => {
//               e.stopPropagation();
//               onEdit?.();
//             }}
//             className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all group/btn"
//           >
//             <FaEdit className="w-3.5 h-3.5 text-gray-600 group-hover/btn:text-red-600 transition-colors" />
//             <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-red-600 transition-colors">
//               Edit
//             </span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//             onClick={(e) => {
//               e.stopPropagation();
//               onDelete?.();
//             }}
//             className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition-all"
//           >
//             <FaTrash className="w-3.5 h-3.5 text-red-600" />
//             <span className="text-sm font-semibold text-red-600">Hapus</span>
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export default WorkflowCard;
