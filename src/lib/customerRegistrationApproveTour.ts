"use client";

import type { CustomerRegistration } from "@/types/customerRegistration";

const CUSTOMER_REGISTRATION_APPROVE_TOUR_PENDING_KEY =
  "ekaplus-customer-registration-approve-tour-pending";

export const CUSTOMER_REGISTRATION_APPROVE_TOUR_ID = "tour-registration-001";

export const customerRegistrationApproveTourDummy: CustomerRegistration = {
  id: CUSTOMER_REGISTRATION_APPROVE_TOUR_ID,
  registration_number: "REG-TOUR-001",
  source: "tour",
  ekaplus_user: {
    id: 99001,
    full_name: "Demo Tour User",
    email: "demo.tour@ekaplus.test",
  },
  user: {
    user_id: 99001,
    full_name: "Jaka Tarub",
    phone: "081234567890",
    email: "jaka.tarub@example.com",
    date_of_birth: "1988-04-17",
    place_of_birth: "Surabaya",
  },
  company: {
    company_type: "Company",
    company_title: "Toko",
    business_type: "Company - Toko",
    name: "TOKO DEMO SEJAHTERA ABADI TK",
    nik: "-",
    npwp: "012345678-901000",
    tax_status: 1,
    tax_status_label: "PKP",
    branch_id: 77,
    branch_name: "Ekatunggal Branch",
    branch_city: "Surabaya",
    product_need: "Furniture",
  },
  address: {
    full_address: "Jl. Raya Industri No. 88, Rungkut",
    province_name: "Jawa Timur",
    city_name: "Surabaya",
    district_name: "Rungkut",
    village_name: "Kali Rungkut",
    rt: "-",
    rw: "-",
    postal_code: "60293",
  },
  support_data: {
    contact_person: "Budi Santoso",
    company_email: "sales@demosejahtera.co.id",
    payment_method: "Transfer",
    payment_account: "BCA",
    more_information: "Data ini dipakai khusus untuk simulasi tour approval.",
    sales_team: "Surabaya Team",
    erp_customer_group: "DISTRIBUTOR",
  },
  branch_owner: {
    full_name: "Rina Wulandari",
    phone: "081298765432",
    email: "rina.wulandari@example.com",
    place_of_birth: "Malang",
    date_of_birth: "1990-09-22",
  },
  master_links: {
    nb_manual: "EKA TOUR",
    gp_manual: "DEMO SEJAHTERA GROUP",
  },
  same_as_company_address: false,
  shipping_addresses: [
    {
      id: 1,
      label: "Gudang Utama",
      address: "Jl. Margomulyo Pergudangan Blok A-12",
      city: "Surabaya",
      province: "Jawa Timur",
      district: "Tandes",
      village: "Balongsari",
      postal_code: "60186",
      pic_name: "Rina Wulandari",
      pic_phone: "081298765432",
      is_default: 1,
      parent_id: 1,
    },
  ],
  documents: {},
  status: "request",
  docstatus: 0,
  submission_date: "2026-07-08T08:00:00.000Z",
  created_at: "2026-07-08T08:00:00.000Z",
  created_by_id: 99001,
  created_by: "Demo Tour User",
  updated_at: "2026-07-08T08:00:00.000Z",
  updated_by_id: 99001,
  updated_by: "Demo Tour User",
};

export function setPendingCustomerRegistrationApproveTour() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    CUSTOMER_REGISTRATION_APPROVE_TOUR_PENDING_KEY,
    "pending",
  );
}

export function consumePendingCustomerRegistrationApproveTour(): boolean {
  if (typeof window === "undefined") return false;
  const value = window.sessionStorage.getItem(
    CUSTOMER_REGISTRATION_APPROVE_TOUR_PENDING_KEY,
  );
  if (value !== "pending") return false;
  window.sessionStorage.removeItem(
    CUSTOMER_REGISTRATION_APPROVE_TOUR_PENDING_KEY,
  );
  return true;
}
