// src/components/workflows/WorkflowList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import WorkflowCard from "./WorkflowCard";
import AddWorkflowModal from "./AddWorkflowModal";
import WorkflowDetailModal from "./WorkflowDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import { FaPlus, FaSearch, FaProjectDiagram, FaCircle, FaArrowRight, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

export type Workflow = {
  id: string;
  name: string;
  display_name: string;
  description: string;
  document_type: string;
  is_active: boolean;
  initial_state: string;
  color: string;
  icon: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type WorkflowState = {
  id: string;
  workflow_id: string;
  name: string;
  display_name: string;
  description: string;
  color: string;
  bg_color: string;
  icon: string;
  sequence: number;
  is_initial: boolean;
  is_final: boolean;
  allow_edit: boolean;
  created_at: string;
};

export type WorkflowTransition = {
  id: string;
  workflow_id: string;
  name: string;
  display_name: string;
  from_state: string;
  to_state: string;
  allowed_roles: string[];
  required_permissions: string[];
  conditions: Array<{
    field: string;
    operator: string;
    message: string;
  }>;
  actions: Array<{
    type: string;
    target?: string;
    template?: string;
    field?: string;
    value?: string;
    code_type?: string;
    tier?: string;
  }>;
  button_label: string;
  button_color: string;
  button_icon: string;
  confirm_message: string | null;
  requires_comment: boolean;
  comment_label?: string;
  created_at: string;
};

const WORKFLOWS_URL = "/data/workflows.json";
const STATES_URL = "/data/workflow_states.json";
const TRANSITIONS_URL = "/data/workflow_transitions.json";
const SNAP_KEY = "ekaplus_workflows_snapshot";

export default function WorkflowList() {
  const { hasPermission, isAuthenticated, isLoading: authLoading } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [states, setStates] = useState<WorkflowState[]>([]);
  const [transitions, setTransitions] = useState<WorkflowTransition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Workflow | null>(null);

  // Permission checks
  const canViewWorkflows = hasPermission('workflows.view');
  const canManageWorkflows = hasPermission('workflows.manage');

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Workflow | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Load data - only if authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      
      try {
        // Load workflows
        const wfRes = await fetch(WORKFLOWS_URL, { cache: "no-store" });
        if (wfRes.ok) {
          const data = await wfRes.json();
          if (!cancelled) {
            const wfList = data.workflows || [];
            setWorkflows(wfList);
            try { localStorage.setItem(SNAP_KEY, JSON.stringify(wfList)); } catch {}
          }
        }

        // Load states
        const statesRes = await fetch(STATES_URL, { cache: "no-store" });
        if (statesRes.ok) {
          const statesData = await statesRes.json();
          if (!cancelled) {
            setStates(statesData.workflow_states || []);
          }
        }

        // Load transitions
        const transRes = await fetch(TRANSITIONS_URL, { cache: "no-store" });
        if (transRes.ok) {
          const transData = await transRes.json();
          if (!cancelled) {
            setTransitions(transData.workflow_transitions || []);
          }
        }

      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // Listen for updates
  useEffect(() => {
    function handler() {
      const raw = localStorage.getItem(SNAP_KEY);
      if (!raw) return;
      try { setWorkflows(JSON.parse(raw) as Workflow[]); } catch {}
    }
    window.addEventListener("ekaplus:workflows_update", handler);
    return () => window.removeEventListener("ekaplus:workflows_update", handler);
  }, []);

  function saveSnapshot(arr: Workflow[]) {
    try { localStorage.setItem(SNAP_KEY, JSON.stringify(arr)); } catch {}
    window.dispatchEvent(new Event("ekaplus:workflows_update"));
  }

  function getWorkflowStates(workflowId: string): WorkflowState[] {
    return states.filter(s => s.workflow_id === workflowId).sort((a, b) => a.sequence - b.sequence);
  }

  function getWorkflowTransitions(workflowId: string): WorkflowTransition[] {
    return transitions.filter(t => t.workflow_id === workflowId);
  }

  function promptDeleteWorkflow(workflow: Workflow) {
    setConfirmTitle("Hapus Workflow");
    setConfirmDesc(`Yakin ingin menghapus workflow "${workflow.display_name}"?`);
    actionRef.current = async () => {
      const next = workflows.filter((x) => x.id !== workflow.id);
      setWorkflows(next);
      saveSnapshot(next);
    };
    setConfirmOpen(true);
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }
  
  function handleEdit(workflow: Workflow) {
    setModalInitial(workflow);
    setModalOpen(true);
  }

  function openDetail(workflow: Workflow) {
    setDetailItem(workflow);
    setDetailOpen(true);
  }
  
  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
  }

  function onDetailEdit(workflow: Workflow) {
    closeDetail();
    setTimeout(() => handleEdit(workflow), 80);
  }
  
  function onDetailDelete(workflow: Workflow) {
    closeDetail();
    setTimeout(() => promptDeleteWorkflow(workflow), 80);
  }

  async function confirmOk() {
    setConfirmOpen(false);
    if (actionRef.current) { 
      await actionRef.current(); 
      actionRef.current = null; 
    }
  }
  
  function confirmCancel() { 
    actionRef.current = null; 
    setConfirmOpen(false); 
  }

  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login required
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Login Diperlukan</h2>
          <p className="text-gray-600 mb-6">
            Silakan login terlebih dahulu untuk mengakses data Workflows.
            Klik tombol Login di pojok kanan atas.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-sm">
            <FaProjectDiagram className="w-4 h-4" />
            <span>Data workflows dilindungi untuk keamanan</span>
          </div>
        </div>
      </div>
    );
  }

  // Check permission
  if (!canViewWorkflows) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Akses Ditolak</h2>
          <p className="text-gray-600">
            Anda tidak memiliki permission untuk melihat data Workflows.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Memuat data workflows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  // Filter workflows
  let filteredWorkflows = workflows;
  
  if (searchQuery.trim()) {
    filteredWorkflows = filteredWorkflows.filter(w => 
      w.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.document_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Stats
  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.is_active).length,
    totalStates: states.length,
    totalTransitions: transitions.length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Workflows</h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola workflow dan approval process
          </p>
        </div>
        
        {canManageWorkflows ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah Workflow</span>
          </motion.button>
        ) : (
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed">
            <FaLock className="w-4 h-4" />
            <span>Tambah Workflow</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FaProjectDiagram className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">Total Workflows</span>
          </div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-700 font-medium">Active</span>
          </div>
          <div className="text-3xl font-bold text-green-900">{stats.active}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <FaCircle className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-700 font-medium">Total States</span>
          </div>
          <div className="text-3xl font-bold text-purple-900">{stats.totalStates}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <FaArrowRight className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-orange-700 font-medium">Transitions</span>
          </div>
          <div className="text-3xl font-bold text-orange-900">{stats.totalTransitions}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari workflow..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Workflows Display */}
      {filteredWorkflows.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaProjectDiagram className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada workflow</h3>
          <p className="text-sm text-gray-500">
            {searchQuery ? 'Coba ubah kata kunci pencarian' : 'Belum ada workflow yang ditambahkan'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              states={getWorkflowStates(workflow.id)}
              transitionCount={getWorkflowTransitions(workflow.id).length}
              onEdit={() => handleEdit(workflow)}
              onDelete={() => promptDeleteWorkflow(workflow)}
              onView={() => openDetail(workflow)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddWorkflowModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        initial={modalInitial}
      />
      
      <WorkflowDetailModal 
        open={detailOpen} 
        onClose={closeDetail} 
        workflow={detailItem}
        states={detailItem ? getWorkflowStates(detailItem.id) : []}
        transitions={detailItem ? getWorkflowTransitions(detailItem.id) : []}
        onEdit={onDetailEdit} 
        onDelete={onDetailDelete} 
      />

      <ConfirmDialog 
        open={confirmOpen} 
        title={confirmTitle} 
        description={confirmDesc} 
        onConfirm={confirmOk} 
        onCancel={confirmCancel} 
        confirmLabel="Ya, Hapus" 
        cancelLabel="Batal" 
      />
    </div>
  );
}