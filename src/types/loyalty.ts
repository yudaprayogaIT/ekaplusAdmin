export type LoyaltyStatus =
  | "SUCCESS"
  | "APPROVED"
  | "ACTIVE"
  | "AVAILABLE"
  | "OPEN"
  | "PENDING"
  | "NEED_REVIEW"
  | "RESERVED"
  | "INCOMPLETE"
  | "FAILED"
  | "REJECTED"
  | "EXPIRED"
  | "NOT_READY"
  | "INACTIVE"
  | "CLOSED"
  | string;

export type LoyaltyRow = Record<string, unknown> & {
  id?: string | number;
  name?: string;
  status?: LoyaltyStatus;
};

export interface LoyaltyListResult<T = LoyaltyRow> {
  rows: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface LoyaltyBalance {
  total_point: number;
  redeemed_point: number;
  reserved_point: number;
  available_point: number;
  buckets: LoyaltyRow[];
}

export interface LoyaltyActionResult {
  data: LoyaltyRow;
  message: string;
}
