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
};

// Variant mapping - links Item to Product
export type ItemVariant = {
  id: number;
  item: Item;
  productid: number;
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