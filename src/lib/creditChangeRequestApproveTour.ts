"use client";

import type { CreditChangeRequestListItem } from "@/components/customers/credit-change-request/CreditChangeRequestDetailModal";

const CREDIT_CHANGE_REQUEST_APPROVE_TOUR_PENDING_KEY =
  "ekaplus-credit-change-request-approve-tour-pending";

export const CREDIT_CHANGE_REQUEST_APPROVE_TOUR_ID = 99001;

export const creditChangeRequestApproveTourDummy: CreditChangeRequestListItem = {
  id: CREDIT_CHANGE_REQUEST_APPROVE_TOUR_ID,
  code: "CCR-TOUR-001",
  policyType: "bcid",
  policyTypeLabel: "Branch Customer",
  policyId: 88001,
  applyToChilds: false,
  currentCreditLimit: 75000000,
  requestedCreditLimit: 125000000,
  currentPaymentTerm: 14,
  requestedPaymentTerm: 30,
  currentLimitCustomerOverdue: 7,
  requestedLimitCustomerOverdue: 14,
  identityAttachment: null,
  customerApprovalAttachment: null,
  reason:
    "Customer membutuhkan kenaikan limit karena volume order naik stabil selama 3 bulan terakhir.",
  rejectedNote: null,
  sagaStatus: null,
  syncSagaId: null,
  syncLastError: null,
  syncLastRollbackError: null,
  status: "In Director",
  docstatus: 0,
  workflowState: "In Director",
  created_at: "2026-07-08T08:00:00.000Z",
  updated_at: "2026-07-09T10:30:00.000Z",
  createdAt: "2026-07-08T08:00:00.000Z",
  updatedAt: "2026-07-09T10:30:00.000Z",
  createdBy: "Demo Tour User",
  updatedBy: "Credit Supervisor",
};

export function setPendingCreditChangeRequestApproveTour() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    CREDIT_CHANGE_REQUEST_APPROVE_TOUR_PENDING_KEY,
    "pending",
  );
}

export function consumePendingCreditChangeRequestApproveTour(): boolean {
  if (typeof window === "undefined") return false;
  const value = window.sessionStorage.getItem(
    CREDIT_CHANGE_REQUEST_APPROVE_TOUR_PENDING_KEY,
  );
  if (value !== "pending") return false;
  window.sessionStorage.removeItem(CREDIT_CHANGE_REQUEST_APPROVE_TOUR_PENDING_KEY);
  return true;
}
