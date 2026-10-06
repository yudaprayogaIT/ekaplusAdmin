"use client";

import { useEffect, useState } from "react";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";

interface ResourceStatusApiRow {
  status?: string | null;
}

interface WorkflowDocumentStateApiRow {
  state_id?: number | string | null;
  state_name?: string | null;
}

interface WorkflowTransitionApiRow {
  from_state_id?: number | string | null;
  allowed_role_ids?: Array<number | string> | null;
}

interface WorkflowDetailApiResponse {
  document_states?: WorkflowDocumentStateApiRow[] | null;
  transitions?: WorkflowTransitionApiRow[] | null;
}

function getWorkflowDetail(payload: unknown): WorkflowDetailApiResponse | null {
  if (!payload || typeof payload !== "object") return null;

  const response = payload as {
    document_states?: unknown;
    transitions?: unknown;
    data?: unknown;
  };
  if (
    Array.isArray(response.document_states) &&
    Array.isArray(response.transitions)
  ) {
    return response as WorkflowDetailApiResponse;
  }

  if (response.data && typeof response.data === "object") {
    const data = response.data as {
      document_states?: unknown;
      transitions?: unknown;
    };
    if (Array.isArray(data.document_states) && Array.isArray(data.transitions)) {
      return data as WorkflowDetailApiResponse;
    }
  }

  return null;
}

function normalizeStatus(value: string): string {
  return value.trim().toLocaleLowerCase("id-ID");
}

export function useResourceStatusOptions(
  endpoint: string,
  workflowResource: string,
  roleIds: Array<string | number>,
  token: string | null,
  enabled = true,
) {
  const [statuses, setStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const roleIdsKey = Array.from(
    new Set(
      roleIds
        .map((roleId) => Number(roleId))
        .filter((roleId) => Number.isFinite(roleId)),
    ),
  )
    .sort((left, right) => left - right)
    .join(",");

  useEffect(() => {
    if (!enabled || !token || !roleIdsKey) {
      setStatuses([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadStatuses() {
      setLoading(true);

      try {
        const [resourceResponse, workflowResponse] = await Promise.all([
          apiFetch(
            getQueryUrl(endpoint, {
              fields: ["status"],
              limit: 0,
              with_total: true,
            }),
            { method: "GET", cache: "no-store" },
            token,
          ),
          apiFetch(
            getQueryUrl(
              `${API_CONFIG.ENDPOINTS.WORKFLOW}/${encodeURIComponent(workflowResource)}`,
              { fields: ["*"] },
            ),
            { method: "GET", cache: "no-store" },
            token,
          ),
        ]);

        if (!resourceResponse.ok) {
          throw new Error(
            `Failed to fetch resource status options (${resourceResponse.status})`,
          );
        }
        if (!workflowResponse.ok) {
          throw new Error(
            `Failed to fetch workflow status permissions (${workflowResponse.status})`,
          );
        }

        const [resourcePayload, workflowPayload] = await Promise.all([
          resourceResponse.json() as Promise<{ data?: unknown }>,
          workflowResponse.json() as Promise<unknown>,
        ]);
        const rows = Array.isArray(resourcePayload?.data)
          ? (resourcePayload.data as ResourceStatusApiRow[])
          : [];
        const resourceStatuses = Array.from(
          new Set(
            rows
              .map((row) => row.status?.trim() || "")
              .filter((status) => status.length > 0),
          ),
        );

        const workflow = getWorkflowDetail(workflowPayload);
        const userRoleIds = new Set(roleIdsKey.split(",").map(Number));
        const allowedFromStateIds = new Set(
          (workflow?.transitions || [])
            .filter((transition) =>
              (transition.allowed_role_ids || []).some((roleId) =>
                userRoleIds.has(Number(roleId)),
              ),
            )
            .map((transition) => Number(transition.from_state_id))
            .filter((stateId) => Number.isFinite(stateId)),
        );
        const allowedStatusNames = new Set(
          (workflow?.document_states || [])
            .filter((state) =>
              allowedFromStateIds.has(Number(state.state_id)),
            )
            .map((state) => normalizeStatus(state.state_name || ""))
            .filter(Boolean),
        );
        const roleFilteredStatuses = resourceStatuses.filter((status) =>
          allowedStatusNames.has(normalizeStatus(status)),
        );

        if (!cancelled) setStatuses(roleFilteredStatuses);
      } catch {
        if (!cancelled) setStatuses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadStatuses();
    return () => {
      cancelled = true;
    };
  }, [enabled, endpoint, roleIdsKey, token, workflowResource]);

  return { statuses, loading };
}
