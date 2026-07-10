"use client";

import {
  FaArrowRight,
  FaCheckCircle,
  FaPaperPlane,
  FaReply,
  FaStickyNote,
} from "react-icons/fa";
import { WorkflowActionItem } from "@/services/workflowActionService";

type Props = {
  actions: WorkflowActionItem[];
  loadingActionId?: number | null;
  disabled?: boolean;
  onActionClick: (action: WorkflowActionItem) => void;
  getActionTourAttribute?: (action: WorkflowActionItem) => string | undefined;
};

function getActionTone(actionLabel: string) {
  const normalized = actionLabel.toLowerCase();

  if (normalized.includes("approve")) {
    return {
      wrapperClassName:
        "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70",
      buttonClassName:
        "from-green-500 to-emerald-600 shadow-green-200 hover:shadow-green-300",
      badgeClassName: "bg-emerald-100 text-emerald-700",
      // helperText: "Lanjutkan approval untuk request ini.",
      icon: <FaCheckCircle className="h-4 w-4" />,
    };
  }

  if (normalized.includes("reject")) {
    return {
      wrapperClassName:
        "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-rose-100/70",
      buttonClassName:
        "from-red-500 to-rose-600 shadow-red-200 hover:shadow-red-300",
      badgeClassName: "bg-rose-100 text-rose-700",
      // helperText: "Wajib isi alasan reject sebelum action dikirim.",
      // requiresNote: true,
      icon: <FaReply className="h-4 w-4" />,
    };
  }

  return {
    wrapperClassName:
      "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-100/70",
    buttonClassName:
      "from-sky-500 to-cyan-600 shadow-sky-200 hover:shadow-sky-300",
    badgeClassName: "bg-sky-100 text-sky-700",
    helperText: "Jalankan action workflow untuk dokumen ini.",
    icon: <FaPaperPlane className="h-4 w-4" />,
  };
}

export default function WorkflowActionBar({
  actions,
  loadingActionId = null,
  disabled = false,
  onActionClick,
  getActionTourAttribute,
}: Props) {
  if (actions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {actions.map((workflowAction) => {
        const tone = getActionTone(workflowAction.action);
        const isLoading = loadingActionId === workflowAction.id;

        return (
          <div
            key={workflowAction.id}
            className={`rounded-2xl border p-4 shadow-sm transition ${tone.wrapperClassName}`}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    {tone.icon}
                  </div>
                  <div>
                    <p className="text-base font-bold">
                      {workflowAction.action}
                    </p>
                    <p className="text-sm text-slate-500">{tone.helperText}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {workflowAction.mode ? (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${tone.badgeClassName}`}
                  >
                    {workflowAction.mode}
                  </span>
                ) : null}
                {/* {tone.requiresNote ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700 shadow-sm">
                    <FaStickyNote className="h-3 w-3" />
                    Note Required
                  </span>
                ) : null} */}
              </div>
            </div>

            <button
              type="button"
              data-tour={getActionTourAttribute?.(workflowAction)}
              onClick={() => onActionClick(workflowAction)}
              disabled={disabled || isLoading}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 ${tone.buttonClassName}`}
            >
              {tone.icon}
              <span>{isLoading ? "Memproses..." : workflowAction.action}</span>
              {!isLoading ? <FaArrowRight className="h-3.5 w-3.5" /> : null}
            </button>
          </div>
        );
      })}
    </div>
  );
}
