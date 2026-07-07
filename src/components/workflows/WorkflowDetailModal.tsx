// src/components/workflows/WorkflowDetailModal.tsx
"use client";

import EntityDetailModal from "@/components/entity-management/EntityDetailModal";
import {
  FaArrowRight,
  FaCheckCircle,
  FaEdit,
  FaSitemap,
  FaTrash,
  FaListUl,
  FaCodeBranch,
} from "react-icons/fa";
import { WorkflowWithDetails, Role } from "./WorkflowList";

type Props = {
  open: boolean;
  onClose: () => void;
  workflow: WorkflowWithDetails | null;
  roles: Role[];
  onEdit: (workflow: WorkflowWithDetails) => void;
  onDelete: (workflow: WorkflowWithDetails) => void;
};

function getDocstatusLabel(docstatus: number) {
  switch (docstatus) {
    case 0:
      return "0 - Draft";
    case 1:
      return "1 - Locked";
    case 2:
      return "2 - Closed";
    default:
      return `${docstatus} - Custom`;
  }
}

function getDocstatusBadgeClass(docstatus: number) {
  switch (docstatus) {
    case 0:
      return "bg-blue-50 text-blue-700";
    case 1:
      return "bg-indigo-50 text-indigo-700";
    case 2:
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-purple-50 text-purple-700";
  }
}

export default function WorkflowDetailModal({
  open,
  onClose,
  workflow,
  roles,
  onEdit,
  onDelete,
}: Props) {
  if (!open || !workflow) return null;

  const { workflow: wf, document_states, transitions } = workflow;
  const sortedStates = [...document_states].sort(
    (a, b) => a.state_id - b.state_id,
  );

  const getRoleName = (roleId: number) => {
    const role = roles.find((item) => item.ID === roleId);
    return role ? role.Name : `Role #${roleId}`;
  };

  const rows = sortedStates.flatMap((state) => {
    const stateTransitions = transitions.filter(
      (transition) => transition.from_state_id === state.state_id,
    );

    if (stateTransitions.length === 0) {
      return [
        {
          rowKey: `state-${state.state_id}-empty`,
          state,
          nextAction: "-",
          toState: "-",
          allowedRoleIds: [] as number[],
        },
      ];
    }

    return stateTransitions.map((transition, index) => {
      const toState = document_states.find(
        (item) => item.state_id === transition.to_state_id,
      );

      return {
        rowKey: `state-${state.state_id}-transition-${transition.id || index}`,
        state,
        nextAction: transition.action || "-",
        toState: toState?.state_name || `#${transition.to_state_id}`,
        allowedRoleIds: transition.allowed_role_ids || [],
      };
    });
  });

  return (
    <EntityDetailModal
      open={open}
      onClose={onClose}
      icon={<FaSitemap className="h-5 w-5" />}
      title="Workflow Detail"
      subtitle={
        <p className="text-sm text-gray-600">Informasi lengkap workflow</p>
      }
      maxWidthClassName="max-w-5xl"
      accentClasses={{
        iconBg: "bg-purple-50",
        iconText: "text-purple-600",
      }}
      actions={
        <>
          <button
            onClick={() => onDelete(workflow)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <FaTrash className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
          <button
            onClick={() => onEdit(workflow)}
            className="ml-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
          >
            <FaEdit className="h-3.5 w-3.5" />
            <span>Edit Workflow</span>
          </button>
        </>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-red-100">
        <div className="grid grid-cols-2 divide-x divide-red-100 border-b border-red-100 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 md:grid-cols-4">
          <div className="px-4 py-3">Item Type</div>
          <div className="px-4 py-3">Description</div>
          <div className="px-4 py-3">Workflow ID</div>
          <div className="px-4 py-3">Status</div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-red-100 bg-white text-sm text-gray-700 md:grid-cols-4">
          <div className="px-4 py-3">
            <code className="text-xs font-semibold text-blue-600">
              {wf.resource}
            </code>
          </div>
          <div className="px-4 py-3">
            {wf.description || `Approval alur ${wf.name.toLowerCase()}`}
          </div>
          <div className="px-4 py-3 font-semibold text-gray-900">
            #{wf.id || "-"}
          </div>
          <div className="px-4 py-3">
            {wf.is_active ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <FaCheckCircle className="h-3 w-3" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
          <FaCodeBranch className="h-3 w-3" />
          <span>State Flow</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {sortedStates.map((state, index) => (
            <div key={state.state_id} className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-gray-800">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: state.color || "#7C3AED" }}
                />
                {state.state_name}
              </span>
              {index < sortedStates.length - 1 ? (
                <FaArrowRight className="h-3 w-3 text-gray-400" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
          <FaListUl className="h-3 w-3" />
          <span>States &amp; Transitions</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-red-100 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-red-100">
              <thead className="bg-gray-50/80">
                <tr className="text-left">
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    State
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    DocStatus
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Editable
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Next Action
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    To State
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Allowed Roles
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100 bg-white">
                {rows.map((row) => {
                  return (
                    <tr key={row.rowKey}>
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-start gap-2">
                          <span
                            className="mt-1 h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: row.state.color || "#7C3AED",
                            }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {row.state.state_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              #{row.state.state_id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getDocstatusBadgeClass(
                            row.state.docstatus,
                          )}`}
                        >
                          {getDocstatusLabel(row.state.docstatus)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
                            row.state.editable
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {row.state.editable ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {row.nextAction}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {row.toState}
                      </td>
                      <td className="px-4 py-3">
                        {row.allowedRoleIds.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {row.allowedRoleIds.map((roleId) => (
                              <span
                                key={`${row.rowKey}-${roleId}`}
                                className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                              >
                                {getRoleName(roleId)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </EntityDetailModal>
  );
}
