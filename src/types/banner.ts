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
  sort_by: number | null;
  show_button: 0 | 1;
  button_display: string | null;
  created_at: string;
  updated_at: string;
  created_by?: number | { id?: number; name?: string };
  updated_by?: number | { id?: number; name?: string };
  owner?: number | { id?: number; name?: string };
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
    sort_by: number | null;
    show_button: number;
    button_display: string | null;
    created_at: string;
    updated_at: string;
    created_by: number | { id?: number; full_name?: string };
    updated_by: number | { id?: number; full_name?: string };
    owner: number | { id?: number; full_name?: string };
  }>;
  meta: Record<string, unknown>;
};
