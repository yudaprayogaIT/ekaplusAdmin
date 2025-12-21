// src/components/types/TypeListNew.tsx
/**
 * Item Types List - New Implementation
 *
 * This is the new implementation using generic components.
 * Once tested and verified, this will replace the old TypeList.tsx
 */

"use client";

import React from "react";
import { GenericList } from "@/components/doctype/GenericList";
import { typeConfig } from "@/config/doctypes/type.config";

/**
 * Item Types List Component (New Implementation)
 */
export default function TypeListNew() {
  return <GenericList config={typeConfig} />;
}
