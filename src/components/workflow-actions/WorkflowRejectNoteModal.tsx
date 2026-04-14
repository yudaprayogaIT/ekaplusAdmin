"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaReply, FaSave, FaTimes } from "react-icons/fa";
import { WorkflowActionItem } from "@/services/workflowActionService";

type Props = {
  open: boolean;
  action: WorkflowActionItem | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (note: string) => Promise<void>;
};

export default function WorkflowRejectNoteModal({
  open,
  action,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setNote("");
    setError(null);
  }, [open, action?.id]);

  if (!open || !action) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
        onClick={(event) => {
          if (event.target === event.currentTarget && !loading) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-red-500 to-rose-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <FaReply className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{action.action}</h3>
                <p className="text-sm text-red-50">Tambahkan catatan reject</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg p-2 transition hover:bg-white/20 disabled:opacity-60"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          <form
            className="space-y-4 p-5"
            onSubmit={async (event) => {
              event.preventDefault();
              const trimmed = note.trim();

              if (!trimmed) {
                setError("Rejected note wajib diisi.");
                return;
              }

              setError(null);
              await onSubmit(trimmed);
            }}
          >
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Rejected Note
              </label>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={5}
                disabled={loading}
                placeholder="Tuliskan alasan reject..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-300 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaSave className="h-4 w-4" />
                {loading ? "Memproses..." : action.action}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
