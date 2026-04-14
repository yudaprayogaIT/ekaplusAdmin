"use client";

import { FaCheckCircle, FaPaperPlane, FaReply } from "react-icons/fa";
import { WorkflowActionItem } from "@/services/workflowActionService";

type Props = {
  actions: WorkflowActionItem[];
  loadingActionId?: number | null;
  disabled?: boolean;
  onActionClick: (action: WorkflowActionItem) => void;
};

function getActionTone(actionLabel: string) {
  const normalized = actionLabel.toLowerCase();

  if (normalized.includes("approve")) {
    return {
      className: "from-green-500 to-emerald-600 shadow-green-200",
      icon: <FaCheckCircle className="h-4 w-4" />,
    };
  }

  if (normalized.includes("reject")) {
    return {
      className: "from-red-500 to-rose-600 shadow-red-200",
      icon: <FaReply className="h-4 w-4" />,
    };
  }

  return {
    className: "from-sky-500 to-cyan-600 shadow-sky-200",
    icon: <FaPaperPlane className="h-4 w-4" />,
  };
}

export default function WorkflowActionBar({
  actions,
  loadingActionId = null,
  disabled = false,
  onActionClick,
}: Props) {
  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((workflowAction) => {
        const tone = getActionTone(workflowAction.action);
        const isLoading = loadingActionId === workflowAction.id;

        return (
          <button
            key={workflowAction.id}
            type="button"
            onClick={() => onActionClick(workflowAction)}
            disabled={disabled || isLoading}
            className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 ${tone.className}`}
          >
            {tone.icon}
            <span>{workflowAction.action}</span>
            {workflowAction.mode ? (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                {workflowAction.mode}
              </span>
            ) : null}
            {isLoading ? (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                Loading
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
