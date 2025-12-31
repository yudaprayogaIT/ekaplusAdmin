export interface CustomerRegistration {
  id: string;

  // 1. Identitas Pemilik/Pimpinan (dari user account)
  owner: {
    user_id: number;
    full_name: string;
    phone: string;
    email: string;
    birth_place: string;
    birth_date: string; // DD/MM/YYYY
  };

  // 2. Informasi Perusahaan
  company: {
    business_type: string;
    name: string;
    nik: string;
    npwp?: string;
    branch_id: number;
    branch_name: string;
  };

  // 3. Alamat Perusahaan
  address: {
    full_address: string;
    province_id: number;
    province_name: string;
    city_id: number;
    city_name: string;
    district_id: number;
    district_name: string;
    village_id: number;
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
  updated_at: string;
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
