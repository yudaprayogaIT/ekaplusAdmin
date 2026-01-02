export interface CustomerRegistration {
  id: string;

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
    business_type: string;
    name: string;
    nik: string;
    npwp?: string;
    branch_id: number;
    branch_name: string;
    branch_city: string
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
  status: 'pending' | 'approved' | 'rejected' | 'draft';
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
  rejected_at?: string;
  rejected_by?: string;
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
  { code: 'incomplete_data', label: 'Data tidak lengkap' },
  { code: 'invalid_document', label: 'Dokumen tidak valid' },
  { code: 'fake_customer', label: 'Customer siluman/iseng' },
  { code: 'duplicate_gp', label: 'GP name sudah ada' },
  { code: 'other', label: 'Lainnya' },
];
