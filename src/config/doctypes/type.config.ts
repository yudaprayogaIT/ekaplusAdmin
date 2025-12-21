// src/config/doctypes/type.config.ts
/**
 * DocType Configuration for Item Types
 *
 * This configuration defines the structure and behavior of the Item Type doctype.
 */

import { DocTypeConfig } from "@/lib/doctype/types";
import { getFileUrl, API_CONFIG } from "@/config/api";

/**
 * Item Type data structure
 */
export type ItemType = {
  id: number;
  name: string;
  image?: string;
  description?: string;
  type_name: string;
  docstatus: number;
  status: string;
  disabled: number;
  updated_at?: string;
  updated_by?: { id: number; name: string };
  created_at?: string;
  created_by?: { id: number; name: string };
  owner?: { id: number; name: string };
  // For file upload
  imageFile?: File | null;
};

/**
 * Item Type Configuration
 */
export const typeConfig: DocTypeConfig<ItemType> = {
  // Metadata
  name: "type",
  label: "Item Type",
  labelPlural: "Item Types",
  description: "Manage item types for product categorization",

  // API Configuration
  endpoint: API_CONFIG.ENDPOINTS.TYPE,
  eventName: "ekatalog:types_update",
  cacheKey: "ekatalog_types_snapshot",

  // Field Definitions
  titleField: "type_name",
  imageField: "image",

  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Enter type name",
      description: "Internal name for the type",
    },
    {
      name: "type_name",
      label: "Type Name",
      type: "text",
      required: true,
      placeholder: "Enter display name",
      description: "Display name shown to users",
    },
    {
      name: "image",
      label: "Image",
      type: "file",
      accept: "image/*",
      fileField: "imageFile",
      description: "Upload an image for this type",
      showInCard: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description",
      description: "Optional description of this type",
    },
    {
      name: "disabled",
      label: "Status",
      type: "select",
      required: true,
      defaultValue: 0,
      options: [
        { value: 0, label: "Active" },
        { value: 1, label: "Disabled" },
      ],
    },
  ],

  listFields: ["type_name", "description"],

  // Sorting Options
  sortOptions: [
    { field: "id", label: "ID: Oldest First", direction: "asc" },
    { field: "id", label: "ID: Newest First", direction: "desc" },
    { field: "type_name", label: "Name: A-Z", direction: "asc" },
    { field: "type_name", label: "Name: Z-A", direction: "desc" },
  ],

  defaultSort: { field: "id", label: "ID: Oldest First", direction: "asc" },

  // Stats Cards
  stats: [
    {
      label: "Total Types",
      value: (items) => items.length,
      colorScheme: "blue",
    },
    {
      label: "Active Types",
      value: (items) => items.filter((t) => t.disabled === 0).length,
      colorScheme: "green",
    },
    {
      label: "With Images",
      value: (items) => items.filter((t) => t.image).length,
      colorScheme: "purple",
    },
  ],

  // Permissions
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
  },

  requireAuth: true,

  // Lifecycle Hooks
  hooks: {
    /**
     * Transform API response to frontend model
     */
    transformApiResponse: (apiData: unknown) => {
      const item = apiData as {
        id: number;
        name: string;
        type_name: string;
        image?: string;
        description?: string;
        docstatus: number;
        status: string;
        disabled: number;
        created_at: string;
        updated_at: string;
        created_by: number;
        updated_by: number;
        owner: number;
      };

      return {
        id: item.id,
        name: item.name,
        type_name: item.type_name,
        image: getFileUrl(item.image),
        description: item.description || undefined,
        docstatus: item.docstatus,
        status: item.status,
        disabled: item.disabled,
        created_at: item.created_at,
        updated_at: item.updated_at,
      } as ItemType;
    },

    /**
     * Transform frontend model to API format
     */
    transformToApi: (data: ItemType) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("type_name", data.type_name);

      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      if (data.description) {
        formData.append("description", data.description);
      }

      formData.append("disabled", String(data.disabled ?? 0));

      return formData;
    },
  },
};
