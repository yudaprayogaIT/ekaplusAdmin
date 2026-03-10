// Type definitions for GP ( Group Parent), GC ( Group Customer), and BC (Branch Customer)

// GP (Group Parent) - Represents a unique business entity
export interface GroupParent {
  id: number; // GPID (auto-increment)
  code?: string; // document name/code (e.g. GP00002)
  name: string; // GPName (unique)
  owner_name?: string; // Owner full name (from registration)
  owner_phone?: string; // Owner phone number
  owner_email?: string; // Owner email address
  created_at: string;
  created_by?: string;
  updated_at: string;
  updated_by?: string;
  disabled?: number;
}

// GC (Group Customer) - Company-level customer
export interface GroupCustomer {
  id: number; // GCID (auto-increment)
  code?: string; // document name/code (e.g. GC00002)
  name: string; // GCName (from company name)
  gp_id: number; // Foreign key to GP
  gp_name?: string; // GP name (for display)
  gp_code?: string; // GP code (for display)
  owner_name?: string; // Owner full name (from registration)
  owner_phone?: string; // Owner phone number
  owner_email?: string; // Owner email address
  created_at: string;
  created_by?: string;
  updated_at: string;
  updated_by?: string;
  disabled?: number;
}

// BC (Branch Customer) - Branch-level customer
export interface BranchCustomer {
  id: number; // BCID (auto-increment)
  code?: string; // document name/code (e.g. BC00002)
  name: string; // BCName (GCName + Branch.city)
  gc_id: number; // Foreign key to GC
  gc_name?: string; // GC name (for display)
  gc_code?: string; // GC code (for display)
  gp_name?: string; // GP name (for display)
  gp_code?: string; // GP code (for display)
  branch_id: number; // Foreign key to Branch
  branch_name?: string; // Branch name (for display)
  branch_city?: string; // Branch city (for display)
  owner_name?: string; // Owner full name (from registration)
  owner_phone?: string; // Owner phone number
  owner_email?: string; // Owner email address
  created_at: string;
  created_by?: string;
  updated_at: string;
  updated_by?: string;
  disabled?: number;
}

// API Response types (for mapping from backend)
export interface GroupParentApiResponse {
  id: number;
  name: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  created_at: string;
  created_by?: number | { id: number; full_name: string };
  updated_at: string;
  updated_by?: number | { id: number; full_name: string };
  disabled?: number;
}

export interface GroupCustomerApiResponse {
  id: number;
  name: string;
  gp_id: number;
  gp?: GroupParentApiResponse;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  created_at: string;
  created_by?: number | { id: number; full_name: string };
  updated_at: string;
  updated_by?: number | { id: number; full_name: string };
  disabled?: number;
}

export interface BranchCustomerApiResponse {
  id: number;
  name: string;
  gc_id: number;
  gc?: GroupCustomerApiResponse;
  branch_id: number;
  branch?: {
    id: number;
    branch_name: string;
    city: string;
  };
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  created_at: string;
  created_by?: number | { id: number; full_name: string };
  updated_at: string;
  updated_by?: number | { id: number; full_name: string };
  disabled?: number;
}
