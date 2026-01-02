// src/utils/itemGrouping.ts
import type { Item } from "@/types";

/**
 * Extract Kategori+SubKategori pattern from item name (first 2 words)
 *
 * Reuses the pattern from VariantSuggestions component for consistency.
 *
 * Examples:
 * - "WALLPAPER PREMIUM Blue Floral A123 Brand Supplier" → "WALLPAPER PREMIUM"
 * - "LANTAI KAYU Brown Solid B456 Brand2 Supplier2" → "LANTAI KAYU"
 * - "SOFA" → "SOFA" (handles items with < 2 words)
 *
 * @param itemName - The full item name
 * @returns The extracted pattern (Kategori+SubKategori)
 */
export function extractProductPrefix(itemName: string): string {
  const trimmed = itemName.trim();

  if (!trimmed) {
    return "";
  }

  const words = trimmed.split(/\s+/);

  // Take first 2 words, or entire name if < 2 words
  const prefix = words.slice(0, 2).join(" ");

  return prefix.toUpperCase();
}

/**
 * Group items by their Kategori+SubKategori pattern
 *
 * Returns a Map where:
 * - Key: Pattern string (e.g., "WALLPAPER PREMIUM")
 * - Value: Array of items matching that pattern
 *
 * Items are sorted by pattern alphabetically for predictable display.
 *
 * @param items - Array of items to group
 * @returns Map of pattern → items
 */
export function groupItemsByPattern(items: Item[]): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();

  for (const item of items) {
    const pattern = extractProductPrefix(item.name);

    if (!pattern) {
      continue; // Skip items with empty names
    }

    if (!groups.has(pattern)) {
      groups.set(pattern, []);
    }

    groups.get(pattern)!.push(item);
  }

  // Sort groups by pattern name for predictable order
  const sortedGroups = new Map(
    Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
  );

  return sortedGroups;
}

/**
 * Suggest a product name from selected items
 *
 * Uses the pattern from the first selected item.
 * Admin can override this suggestion in the UI.
 *
 * @param items - Array of selected items
 * @returns Suggested product name
 */
export function suggestProductName(items: Item[]): string {
  if (items.length === 0) {
    return "";
  }

  return extractProductPrefix(items[0].name);
}

/**
 * Get items by their pattern
 *
 * Helper function to filter items matching a specific pattern.
 * Useful for "Select All in Group" functionality.
 *
 * @param items - All available items
 * @param pattern - The pattern to match
 * @returns Items matching the pattern
 */
export function getItemsByPattern(items: Item[], pattern: string): Item[] {
  return items.filter((item) => extractProductPrefix(item.name) === pattern);
}
