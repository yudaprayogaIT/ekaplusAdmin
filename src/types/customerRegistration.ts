export interface CustomerRegistration {
  id: string;
  source?: string;
  ekaplus_user?: {
    id?: number | string;
    full_name?: string;
    email?: string;
  };

  // 1. Identitas Pemilik/Pimpinan (dari user account)
  user: {
    user_id: number;
    full_name: string;
    phone: string;
    email: string;
    date_of_birth: string;
    place_of_birth: string;
  };

  // 2. Informasi Perusahaan
  company: {
    company_type?: string;
    company_title?: string;
    business_type: string;
    name: string;
    nik: string;
    npwp?: string;
    branch_id: number;
    branch_name: string;
    branch_city: string;
    product_need?: string;
  };

  // 3. Alamat Perusahaan
  address: {
    full_address: string;
    province_name: string;
    city_name: string;
    district_name: string;
    village_name: string;
    rt: string;
    rw: string;
    postal_code: string;
  };

  // 4. Data Pendukung
  support_data: {
    contact_person?: string;
    company_email?: string;
    fax?: string;
    factory_address?: string;
  };

  // 4a. Identitas Penanggung Jawab Cabang
  branch_owner?: {
    full_name: string;
    phone: string;
    email: string;
    place_of_birth?: string;
    date_of_birth?: string;
  };

  // 4b. Relasi master data hasil approval/sinkronisasi
  master_links?: {
    nb_id?: number;
    nb_name?: string;
    gp_id?: number;
    gp_name?: string;
    gc_id?: number;
    gc_name?: string;
    bc_id?: number;
    bc_name?: string;
  };

  // 4c. Informasi sinkronisasi
  sync_info?: {
    sync_saga_id?: string;
    erp_customer_id?: string;
    crm_customer_id?: string;
    sync_last_error?: string;
  };

  same_as_company_address?: boolean;
  shipping_addresses?: CustomerRegistrationShippingAddress[];

  // 5. Dokumen
  documents: {
    ktp_photo?: {
      url: string;
      filename: string;
    };
    npwp_photo?: {
      url: string;
      filename: string;
    };
  };

  // Status & Metadata
  status: "pending" | "approved" | "rejected" | "draft";
  submission_date: string;
  created_at: string;
  created_by?: string;
  updated_at: string;
  updated_by?: string;

  // Approval metadata (populated when status = 'approved')
  gp_id?: number;
  gp_name?: string;
  gc_id?: number;
  gc_name?: string;
  bc_id?: number;
  bc_name?: string;
  approved_at?: string;
  approved_by?: string;

  // Rejection metadata (populated when status = 'rejected')
  rejection_reason?: string;
  rejection_notes?: string;
  reject_reason?: string;
  reject_notes?: string;
  rejected_at?: string;
  rejected_by?: string;
}

export interface CustomerRegistrationShippingAddress {
  id?: number;
  label: string;
  address: string;
  city: string;
  province: string;
  district?: string;
  postal_code?: string;
  country?: string;
  pic_name?: string;
  pic_phone?: string;
  is_default?: number | boolean;
  parent_id?: number;
}

export interface ApprovalDraft {
  nb_mode: "skip" | "select" | "create";
  selected_nb_id?: number;
  new_nb_name?: string;
  gp_mode: "select" | "create";
  selected_gp_id?: number;
  new_gp_name?: string;
}

export interface ApprovalResult {
  nbid?: number;
  gpid: number;
  gcid: number;
  bcid: number;
}

export interface ApprovalOperationLog {
  stage: string;
  status: "started" | "success" | "failed";
  message: string;
  payload?: unknown;
  response?: unknown;
  http_status?: number;
}

// For filters
export interface RegistrationFilters {
  status?: string[];
  branch_id?: number[];
  search?: string;
}

// For stats
export interface RegistrationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// Rejection Reasons
export interface RejectionReason {
  code: string;
  label: string;
}

export const REJECTION_REASONS: RejectionReason[] = [
  { code: "incomplete_data", label: "Data tidak lengkap" },
  { code: "invalid_document", label: "Dokumen tidak valid" },
  { code: "fake_customer", label: "Customer siluman/iseng" },
  { code: "duplicate_customer", label: "Customer sudah terdaftar" },
  { code: "other", label: "Lainnya" },
];
