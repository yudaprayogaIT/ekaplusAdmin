// src/types/index.ts

export type Branch = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Item = {
  id: number;
  code: string;
  name: string;
  color: string;
  type: string;
  uom: string;
  image?: string;
  branches?: Branch[];
  description?: string;
  category?: string; // Item category
  group?: string; // Item group
  disabled?: number;
};

// API Response dari backend (actual structure)
export type ItemVariantApiResponse = {
  id: number;
  name: string; // Auto-generated hash oleh backend
  item: number; // Item ID (foreign key)
  idx: number; // Display order/urutan
  parent_id: number; // Product ID
  parent_type: string; // "ekatalog_product"
  parent_field: string; // "variants"
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  owner: number;
};

// Variant mapping - links Item to Product (for frontend)
export type ItemVariant = {
  id: number;
  item: Item; // Full Item object (di-hydrate dari API)
  productid: number; // From parent_id
  displayOrder: number; // From idx
};

// Request types untuk API (simplified - backend auto-generates the rest)
export type CreateVariantRequest = {
  item: number; // Item ID only
};

export type UpdateVariantRequest = {
  item?: number; // Can update item
  idx?: number; // Can update order
};

// Product with variants (for display)
export type Product = {
  id: number;
  name: string;
  itemCategory: Category;
  variants: ItemVariant[];
  disabled: number;
  isHotDeals: boolean;
};

// Product for modal (variants as Item[])
export type ProductFormData = {
  id?: number;
  name: string;
  itemCategory: Category;
  variants: Item[];
  disabled: number;
  isHotDeals: boolean;
};

// Raw product from JSON (no variants)
export type ProductRaw = {
  id: number;
  name: string;
  itemCategory: Category;
  disabled: number;
  isHotDeals: boolean;
};