// src/config/filterFields.ts

import { EntityFilterConfig } from "@/types/filter";

// Product filter fields
export const PRODUCT_FILTER_FIELDS: EntityFilterConfig = {
  entity: "product",
  fields: [
    {
      field: "product_name",
      label: "Product Name",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "item_category",
      label: "Category",
      type: "relation",
      operators: ["=", "!=", "in", "not in"],
      relationEntity: "category",
    },
    {
      field: "hot_deals",
      label: "Hot Deals",
      type: "select",
      operators: ["="],
      options: [
        { value: 1, label: "Yes" },
        { value: 0, label: "No" },
      ],
    },
    {
      field: "disabled",
      label: "Status",
      type: "select",
      operators: ["="],
      options: [
        { value: 0, label: "Enabled" },
        { value: 1, label: "Disabled" },
      ],
    },
    {
      field: "variants",
      label: "Has Variants",
      type: "relation",
      operators: ["is", "is not"],
    },
    // Audit Trail filters
    {
      field: "created_by",
      label: "Created By (User ID)",
      type: "number",
      operators: ["=", "!=", "in", "not in"],
    },
    {
      field: "created_at",
      label: "Created Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
    {
      field: "updated_by",
      label: "Updated By (User ID)",
      type: "number",
      operators: ["=", "!=", "in", "not in"],
    },
    {
      field: "updated_at",
      label: "Updated Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
  ],
};

// Item filter fields
export const ITEM_FILTER_FIELDS: EntityFilterConfig = {
  entity: "item",
  fields: [
    {
      field: "item_name",
      label: "Item Name",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "item_code",
      label: "Item Code",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "item_category",
      label: "Category",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "item_group",
      label: "Item Group",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "ekatalog_type",
      label: "Type",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "item_color",
      label: "Color",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "disabled",
      label: "Status",
      type: "select",
      operators: ["="],
      options: [
        { value: 0, label: "Enabled" },
        { value: 1, label: "Disabled" },
      ],
    },
    // Audit Trail filters
    {
      field: "created_by",
      label: "Created By (User ID)",
      type: "number",
      operators: ["=", "!=", "in", "not in"],
    },
    {
      field: "created_at",
      label: "Created Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
    {
      field: "updated_by",
      label: "Updated By (User ID)",
      type: "number",
      operators: ["=", "!=", "in", "not in"],
    },
    {
      field: "updated_at",
      label: "Updated Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
  ],
};

// Variant filter fields
export const VARIANT_FILTER_FIELDS: EntityFilterConfig = {
  entity: "variant",
  fields: [
    {
      field: "name",
      label: "Variant Name",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "item",
      label: "Item",
      type: "relation",
      operators: ["=", "!=", "in", "not in"],
      relationEntity: "item",
    },
    {
      field: "parent_id",
      label: "Product",
      type: "relation",
      operators: ["=", "!=", "in", "not in"],
      relationEntity: "product",
    },
    {
      field: "item_category",
      label: "Category",
      type: "relation",
      operators: ["=", "!=", "in", "not in"],
      relationEntity: "category",
    },
    {
      field: "idx",
      label: "Display Order",
      type: "number",
      operators: ["=", "!=", ">", ">=", "<", "<="],
    },
    // Audit Trail filters
    {
      field: "created_by",
      label: "Created By (User ID)",
      type: "number",
      operators: ["=", "!=", "in", "not in"],
    },
    {
      field: "created_at",
      label: "Created Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
    {
      field: "updated_by",
      label: "Updated By (User ID)",
      type: "number",
      operators: ["=", "!=", "in", "not in"],
    },
    {
      field: "updated_at",
      label: "Updated Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
  ],
};

// User filter fields
export const USER_FILTER_FIELDS: EntityFilterConfig = {
  entity: "user",
  fields: [
    {
      field: "full_name",
      label: "Full Name",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "username",
      label: "Username",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "email",
      label: "Email",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "phone",
      label: "Phone",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "role",
      label: "Role",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "status",
      label: "Status",
      type: "select",
      operators: ["=", "!=", "in", "not in"],
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
        { value: "suspended", label: "Suspended" },
      ],
    },
    {
      field: "is_email_verified",
      label: "Email Verified",
      type: "select",
      operators: ["="],
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
    },
    {
      field: "is_phone_verified",
      label: "Phone Verified",
      type: "select",
      operators: ["="],
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
    },
  ],
};

// Category filter fields
export const CATEGORY_FILTER_FIELDS: EntityFilterConfig = {
  entity: "category",
  fields: [
    {
      field: "category_name",
      label: "Category Name",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "disabled",
      label: "Status",
      type: "select",
      operators: ["="],
      options: [
        { value: 0, label: "Enabled" },
        { value: 1, label: "Disabled" },
      ],
    },
  ],
};

// Branch filter fields
export const BRANCH_FILTER_FIELDS: EntityFilterConfig = {
  entity: "branch",
  fields: [
    {
      field: "branch_name",
      label: "Branch Name",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "area",
      label: "Area",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "island",
      label: "Island",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "kota",
      label: "City",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "disabled",
      label: "Status",
      type: "select",
      operators: ["="],
      options: [
        { value: 0, label: "Enabled" },
        { value: 1, label: "Disabled" },
      ],
    },
  ],
};

// Wishlist filter fields
export const WISHLIST_FILTER_FIELDS: EntityFilterConfig = {
  entity: "wishlist",
  fields: [
    {
      field: "name",
      label: "Name",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "item",
      label: "Item",
      type: "relation",
      operators: ["=", "!=", "in", "not in"],
      relationEntity: "item",
    },
    {
      field: "user_id",
      label: "User",
      type: "relation",
      operators: ["=", "!=", "in", "not in"],
      relationEntity: "user",
    },
    {
      field: "status",
      label: "Status",
      type: "select",
      operators: ["=", "!=", "in", "not in"],
      options: [
        { value: "Draft", label: "Draft" },
        { value: "Submitted", label: "Submitted" },
        { value: "Approved", label: "Approved" },
        { value: "Cancelled", label: "Cancelled" },
      ],
    },
    {
      field: "docstatus",
      label: "Document Status",
      type: "select",
      operators: ["="],
      options: [
        { value: 0, label: "Draft" },
        { value: 1, label: "Submitted" },
        { value: 2, label: "Cancelled" },
      ],
    },
  ],
};

// Customer Registration filter fields
export const CUSTOMER_REGISTER_FILTER_FIELDS: EntityFilterConfig = {
  entity: "ekatalog_customer_register",
  fields: [
    {
      field: "owner.full_name",
      label: "Owner Name",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "owner.phone",
      label: "Owner Phone",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "owner.email",
      label: "Owner Email",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "business_name",
      label: "Company Name",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "nik",
      label: "NIK",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "npwp",
      label: "NPWP",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "type",
      label: "Business Type",
      type: "select",
      operators: ["=", "!=", "in", "not in"],
      options: [
        { value: "Badan", label: "Badan" },
        { value: "Perorangan", label: "Perorangan" },
      ],
    },
    {
      field: "entity",
      label: "Entity Type",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "branch_id",
      label: "Branch",
      type: "relation",
      operators: ["=", "!=", "in", "not in"],
      relationEntity: "branch",
    },
    {
      field: "city",
      label: "City",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "province",
      label: "Province",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "status",
      label: "Status",
      type: "select",
      operators: ["=", "!=", "in", "not in"],
      options: [
        { value: "Draft", label: "Draft" },
        { value: "Pending", label: "Pending" },
        { value: "Approved", label: "Approved" },
        { value: "Rejected", label: "Rejected" },
      ],
    },
    {
      field: "docstatus",
      label: "Document Status",
      type: "select",
      operators: ["="],
      options: [
        { value: 0, label: "Draft" },
        { value: 1, label: "Submitted" },
        { value: 2, label: "Cancelled" },
      ],
    },
    // Audit Trail filters
    {
      field: "created_at",
      label: "Created Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
    {
      field: "updated_at",
      label: "Updated Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
  ],
};

// Global Party (GP) filter fields
export const GLOBAL_PARTY_FILTER_FIELDS: EntityFilterConfig = {
  entity: "ekatalog_global_party",
  fields: [
    {
      field: "name",
      label: "GP Name",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "disabled",
      label: "Status",
      type: "select",
      operators: ["="],
      options: [
        { value: 0, label: "Enabled" },
        { value: 1, label: "Disabled" },
      ],
    },
    // Audit Trail filters
    {
      field: "created_by",
      label: "Created By (User ID)",
      type: "number",
      operators: ["=", "!=", "in", "not in"],
    },
    {
      field: "created_at",
      label: "Created Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
    {
      field: "updated_by",
      label: "Updated By (User ID)",
      type: "number",
      operators: ["=", "!=", "in", "not in"],
    },
    {
      field: "updated_at",
      label: "Updated Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
  ],
};

// Global Customer (GC) filter fields
export const GLOBAL_CUSTOMER_FILTER_FIELDS: EntityFilterConfig = {
  entity: "ekatalog_global_customer",
  fields: [
    {
      field: "name",
      label: "GC Name",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "gp_id",
      label: "Global Party",
      type: "relation",
      operators: ["=", "!=", "in", "not in"],
      relationEntity: "ekatalog_global_party",
    },
    {
      field: "disabled",
      label: "Status",
      type: "select",
      operators: ["="],
      options: [
        { value: 0, label: "Enabled" },
        { value: 1, label: "Disabled" },
      ],
    },
    // Audit Trail filters
    {
      field: "created_by",
      label: "Created By (User ID)",
      type: "number",
      operators: ["=", "!=", "in", "not in"],
    },
    {
      field: "created_at",
      label: "Created Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
    {
      field: "updated_by",
      label: "Updated By (User ID)",
      type: "number",
      operators: ["=", "!=", "in", "not in"],
    },
    {
      field: "updated_at",
      label: "Updated Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
  ],
};

// Branch Customer (BC) filter fields
export const BRANCH_CUSTOMER_FILTER_FIELDS: EntityFilterConfig = {
  entity: "ekatalog_branch_customer",
  fields: [
    {
      field: "name",
      label: "BC Name",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "gc_id",
      label: "Global Customer",
      type: "relation",
      operators: ["=", "!=", "in", "not in"],
      relationEntity: "ekatalog_global_customer",
    },
    {
      field: "branch_id",
      label: "Branch",
      type: "relation",
      operators: ["=", "!=", "in", "not in"],
      relationEntity: "branch",
    },
    {
      field: "branch_city",
      label: "Branch City",
      type: "string",
      operators: ["=", "!=", "like", "not like"],
    },
    {
      field: "disabled",
      label: "Status",
      type: "select",
      operators: ["="],
      options: [
        { value: 0, label: "Enabled" },
        { value: 1, label: "Disabled" },
      ],
    },
    // Audit Trail filters
    {
      field: "created_by",
      label: "Created By (User ID)",
      type: "number",
      operators: ["=", "!=", "in", "not in"],
    },
    {
      field: "created_at",
      label: "Created Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
    {
      field: "updated_by",
      label: "Updated By (User ID)",
      type: "number",
      operators: ["=", "!=", "in", "not in"],
    },
    {
      field: "updated_at",
      label: "Updated Date",
      type: "date",
      operators: ["=", ">", ">=", "<", "<=", "between"],
    },
  ],
};
