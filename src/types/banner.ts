// src/types/banner.ts

// Banner Types enum
export type BannerType = "url" | "internal_route" | "product" | "category" | "none";

// Main Banner type (for display)
export type Banner = {
  id: number;
  name: string;
  banner_name: string;
  image?: string; // Full URL from getFileUrl()
  type: BannerType;
  type_value: string | null;
  disabled: 0 | 1;
  display_order: number;
  start_date: string | null; // ISO date string
  end_date: string | null; // ISO date string
  click_count?: number; // From analytics join
  docstatus: number;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
  owner?: number;
};

// API Response structure
export type BannerAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Array<{
    id: number;
    name: string;
    banner_name: string;
    image: string | null; // UUID or filename
    type: string;
    type_value: string | null;
    disabled: number;
    display_order: number;
    start_date: string | null;
    end_date: string | null;
    click_count?: number;
    docstatus: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    owner: number;
  }>;
  meta: Record<string, unknown>;
};

// Schedule status helper type
export type ScheduleStatus = "scheduled" | "active" | "expired" | "none";
