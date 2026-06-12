"use client";

import { API_CONFIG, apiFetch, getApiUrl, getAuthHeaders } from "@/config/api";

export interface WorkflowActionItem {
  action: string;
  id: number;
  mode?: string | null;
}

export interface ExecuteWorkflowActionParams {
  token: string;
  resourceName: string;
  documentId: number;
  actionId: number;
  payload?: Record<string, unknown>;
}

export async function executeWorkflowAction({
  token,
  resourceName,
  documentId,
  actionId,
  payload,
}: ExecuteWorkflowActionParams): Promise<unknown> {
  const response = await apiFetch(
    getApiUrl(
      `${API_CONFIG.ENDPOINTS.WORKFLOW_EXECUTE}/${resourceName}/${documentId}/${actionId}`
    ),
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload ?? {}),
      cache: "no-store",
    },
    token
  );

  const responseBody = await response
    .json()
    .catch(async () => ({ message: await response.text().catch(() => "") }));

  if (!response.ok) {
    const message =
      typeof responseBody === "object" &&
      responseBody &&
      "message" in responseBody &&
      typeof responseBody.message === "string"
        ? responseBody.message
        : `Failed to execute workflow action (${response.status})`;

    throw new Error(message);
  }

  return responseBody;
}
