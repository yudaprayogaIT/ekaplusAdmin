export interface Contact {
  id: number;
  name?: string;
  full_name: string;
  display_name?: string;
  notes?: string;
  disabled?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface ContactIdentity {
  id: number;
  name?: string;
  contact_id: number;
  channel: string;
  handle: string;
  external_id?: string;
  is_verified?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerPosition {
  id: number;
  name?: string;
  position_name: string;
  notes?: string;
  disabled?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerContact {
  id: number;
  name?: string;
  parent_id: number;
  parent_type: string;
  contact_id: number;
  position_id: number;
  title?: string;
  is_primary?: number;
  created_at?: string;
  updated_at?: string;
}
