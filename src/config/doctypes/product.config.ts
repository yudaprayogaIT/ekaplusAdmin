// src/config/doctypes/product.config.ts
/**
 * DocType Configuration for Products
 *
 * This is a template/example configuration showing how to create a new doctype.
 * Products have fields like name, category, price, stock, image, and description.
 */

import { DocTypeConfig } from "@/lib/doctype/types";
import { API_CONFIG } from "@/config/api";

/**
 * Product data structure
 */
export type Product = {
  id: number;
  product_name: string;
  category_id?: number;
  category_name?: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
  status: string;
  disabled: number;
  created_at?: string;
  updated_at?: string;
  // For file upload
  imageFile?: File | null;
};

/**
 * Mock data for testing (since we don't have API)
 * In real implementation, this would come from API
 */
export const mockProducts: Product[] = [
  {
    id: 1,
    product_name: "Laptop Dell XPS 13",
    category_id: 1,
    category_name: "Electronics",
    price: 15000000,
    stock: 25,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
    description: "Laptop premium dengan processor Intel i7, RAM 16GB, SSD 512GB",
    status: "Active",
    disabled: 0,
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
  },
  {
    id: 2,
    product_name: "iPhone 15 Pro",
    category_id: 1,
    category_name: "Electronics",
    price: 18000000,
    stock: 50,
    image: "https://images.unsplash.com/photo-1696446702183-cbd50c0c6cfd?w=400",
    description: "Smartphone flagship Apple dengan chip A17 Pro, kamera 48MP",
    status: "Active",
    disabled: 0,
    created_at: "2024-01-16",
    updated_at: "2024-01-16",
  },
  {
    id: 3,
    product_name: "Samsung Galaxy S24",
    category_id: 1,
    category_name: "Electronics",
    price: 12000000,
    stock: 35,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
    description: "Smartphone Android terbaru dengan AI features, layar AMOLED 6.2 inch",
    status: "Active",
    disabled: 0,
    created_at: "2024-01-17",
    updated_at: "2024-01-17",
  },
  {
    id: 4,
    product_name: "Sony WH-1000XM5",
    category_id: 2,
    category_name: "Audio",
    price: 5500000,
    stock: 15,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    description: "Headphone wireless dengan noise cancellation terbaik di kelasnya",
    status: "Active",
    disabled: 0,
    created_at: "2024-01-18",
    updated_at: "2024-01-18",
  },
  {
    id: 5,
    product_name: "MacBook Pro 14 inch",
    category_id: 1,
    category_name: "Electronics",
    price: 28000000,
    stock: 10,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    description: "Laptop profesional dengan chip M3 Pro, display Liquid Retina XDR",
    status: "Active",
    disabled: 0,
    created_at: "2024-01-19",
    updated_at: "2024-01-19",
  },
  {
    id: 6,
    product_name: "iPad Air M2",
    category_id: 1,
    category_name: "Electronics",
    price: 9500000,
    stock: 20,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    description: "Tablet serbaguna dengan chip M2, mendukung Apple Pencil Pro",
    status: "Active",
    disabled: 0,
    created_at: "2024-01-20",
    updated_at: "2024-01-20",
  },
  {
    id: 7,
    product_name: "Canon EOS R6 Mark II",
    category_id: 3,
    category_name: "Camera",
    price: 42000000,
    stock: 5,
    image: "https://images.unsplash.com/photo-1606980707244-92970b1d6986?w=400",
    description: "Kamera mirrorless full-frame dengan sensor 24MP, video 4K 60fps",
    status: "Active",
    disabled: 0,
    created_at: "2024-01-21",
    updated_at: "2024-01-21",
  },
  {
    id: 8,
    product_name: "Logitech MX Master 3S",
    category_id: 4,
    category_name: "Accessories",
    price: 1500000,
    stock: 40,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    description: "Mouse wireless ergonomis untuk produktivitas maksimal",
    status: "Active",
    disabled: 0,
    created_at: "2024-01-22",
    updated_at: "2024-01-22",
  },
  {
    id: 9,
    product_name: "Nintendo Switch OLED",
    category_id: 5,
    category_name: "Gaming",
    price: 5200000,
    stock: 0,
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400",
    description: "Konsol gaming hybrid dengan layar OLED 7 inch",
    status: "Out of Stock",
    disabled: 0,
    created_at: "2024-01-23",
    updated_at: "2024-01-23",
  },
  {
    id: 10,
    product_name: "Samsung 55 inch QLED TV",
    category_id: 1,
    category_name: "Electronics",
    price: 13500000,
    stock: 8,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    description: "Smart TV 4K dengan teknologi Quantum Dot, HDR10+",
    status: "Active",
    disabled: 0,
    created_at: "2024-01-24",
    updated_at: "2024-01-24",
  },
];

/**
 * Product Configuration
 */
export const productConfig: DocTypeConfig<Product> = {
  // Metadata
  name: "product",
  label: "Product",
  labelPlural: "Products",
  description: "Manage your product catalog",

  // API Configuration (using mock endpoint for now)
  endpoint: "/resource/product", // This would be API_CONFIG.ENDPOINTS.PRODUCT
  eventName: "ekatalog:products_update",
  cacheKey: "ekatalog_products_snapshot",

  // Field Definitions
  titleField: "product_name",
  imageField: "image",
  badgeField: "status",

  fields: [
    {
      name: "product_name",
      label: "Product Name",
      type: "text",
      required: true,
      placeholder: "Enter product name",
      description: "Unique name for the product",
    },
    {
      name: "category_name",
      label: "Category",
      type: "text",
      required: false,
      placeholder: "Enter category",
      description: "Product category (e.g., Electronics, Audio, Camera)",
    },
    {
      name: "price",
      label: "Price (Rp)",
      type: "number",
      required: true,
      placeholder: "0",
      description: "Product price in Rupiah",
      format: (value) => `Rp ${Number(value).toLocaleString("id-ID")}`,
    },
    {
      name: "stock",
      label: "Stock Quantity",
      type: "number",
      required: true,
      placeholder: "0",
      defaultValue: 0,
      description: "Available stock quantity",
    },
    {
      name: "image",
      label: "Product Image",
      type: "file",
      accept: "image/*",
      fileField: "imageFile",
      description: "Upload product image (max 5MB)",
      showInCard: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter product description",
      description: "Detailed product description",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      defaultValue: "Active",
      options: [
        { value: "Active", label: "Active" },
        { value: "Out of Stock", label: "Out of Stock" },
        { value: "Discontinued", label: "Discontinued" },
      ],
    },
    {
      name: "disabled",
      label: "Disabled",
      type: "select",
      required: true,
      defaultValue: 0,
      options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" },
      ],
    },
  ],

  listFields: ["product_name", "category_name", "price", "stock"],
  searchFields: ["product_name", "description", "category_name"],

  // Filtering
  filters: [
    {
      name: "category",
      label: "Category",
      field: "category_name",
      type: "select",
      options: [
        { value: null, label: "All Categories" },
        { value: "Electronics", label: "Electronics" },
        { value: "Audio", label: "Audio" },
        { value: "Camera", label: "Camera" },
        { value: "Accessories", label: "Accessories" },
        { value: "Gaming", label: "Gaming" },
      ],
    },
    {
      name: "status",
      label: "Status",
      field: "status",
      type: "select",
      options: [
        { value: null, label: "All Status" },
        { value: "Active", label: "Active" },
        { value: "Out of Stock", label: "Out of Stock" },
        { value: "Discontinued", label: "Discontinued" },
      ],
    },
  ],

  // Sorting Options
  sortOptions: [
    { field: "id", label: "Newest First", direction: "desc" },
    { field: "id", label: "Oldest First", direction: "asc" },
    { field: "product_name", label: "Name: A-Z", direction: "asc" },
    { field: "product_name", label: "Name: Z-A", direction: "desc" },
    { field: "price", label: "Price: Low to High", direction: "asc" },
    { field: "price", label: "Price: High to Low", direction: "desc" },
    { field: "stock", label: "Stock: Low to High", direction: "asc" },
    { field: "stock", label: "Stock: High to Low", direction: "desc" },
  ],

  defaultSort: { field: "id", label: "Newest First", direction: "desc" },

  // Stats Cards
  stats: [
    {
      label: "Total Products",
      value: (items) => items.length,
      colorScheme: "blue",
      description: "All products in catalog",
    },
    {
      label: "Active Products",
      value: (items) => items.filter((p) => p.status === "Active").length,
      colorScheme: "green",
      description: "Currently available",
    },
    {
      label: "Out of Stock",
      value: (items) => items.filter((p) => p.stock === 0).length,
      colorScheme: "red",
      description: "Needs restocking",
    },
    {
      label: "Total Value",
      value: (items) =>
        `Rp ${items
          .reduce((sum, p) => sum + p.price * p.stock, 0)
          .toLocaleString("id-ID")}`,
      colorScheme: "purple",
      description: "Inventory value",
    },
  ],

  // Grouping by category
  groupBy: {
    field: "category_name",
    label: (value) => `Category: ${value || "Uncategorized"}`,
    description: (value) =>
      `All products in ${value || "uncategorized"} category`,
  },

  // Permissions (all allowed for testing)
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
  },

  requireAuth: false, // No auth required for testing

  // UI Options
  defaultViewMode: "grid",
  showViewModeToggle: true,
  showSearch: true,
  showFilters: true,
  showSort: true,
  showStats: true,

  // Lifecycle Hooks
  hooks: {
    /**
     * Transform API response to frontend model
     * For now, just pass through since we're using mock data
     */
    transformApiResponse: (apiData: unknown) => {
      return apiData as Product;
    },

    /**
     * Transform frontend model to API format
     */
    transformToApi: (data: Product) => {
      const formData = new FormData();

      formData.append("product_name", data.product_name);
      formData.append("category_name", data.category_name || "");
      formData.append("price", String(data.price));
      formData.append("stock", String(data.stock));
      formData.append("description", data.description || "");
      formData.append("status", data.status);
      formData.append("disabled", String(data.disabled ?? 0));

      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      return formData;
    },

    /**
     * Validation
     */
    validate: (data: Product) => {
      const errors: Record<string, string> = {};

      if (data.price < 0) {
        errors.price = "Price cannot be negative";
      }

      if (data.stock < 0) {
        errors.stock = "Stock cannot be negative";
      }

      return Object.keys(errors).length > 0 ? errors : null;
    },
  },
};
