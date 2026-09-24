export interface CustomerChangeRequest {
  id: number;
  name: string;
  entityId: number;
  entityType: string;
  entityDisplayName: string;
  reason: string;
  rejectedNote: string;
  status: string;
  docstatus: number;
  appliedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string;
}

export interface CustomerChangeRequestDetail {
  id: number;
  idx: number;
  fieldLabel: string;
  fieldName: string;
  fieldType: string;
  oldValue: unknown;
  newValue: unknown;
}
