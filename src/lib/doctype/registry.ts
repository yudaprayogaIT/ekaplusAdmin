// src/lib/doctype/registry.ts
/**
 * DocType Registry
 *
 * Central registry for managing doctype configurations. Allows you to:
 * - Register doctype configurations
 * - Retrieve configurations by name
 * - List all registered doctypes
 * - Check if a doctype exists
 *
 * @example
 * ```typescript
 * // Register a doctype
 * registerDocType(branchConfig)
 *
 * // Get a doctype config
 * const config = getDocType('branch')
 *
 * // List all doctypes
 * const all = getAllDocTypes()
 * ```
 */

import type { DocTypeConfig } from "./types";

/**
 * Internal registry storage
 */
const registry = new Map<string, DocTypeConfig<any>>();

/**
 * Register a doctype configuration
 *
 * @template T The type of the doctype
 * @param config DocType configuration to register
 * @throws Error if doctype with same name already registered
 */
export function registerDocType<T extends Record<string, unknown>>(
  config: DocTypeConfig<T>
): void {
  if (registry.has(config.name)) {
    console.warn(
      `DocType '${config.name}' is already registered. Overwriting...`
    );
  }

  registry.set(config.name, config);
  console.log(`✅ DocType '${config.name}' registered successfully`);
}

/**
 * Get a doctype configuration by name
 *
 * @template T The type of the doctype
 * @param name Name of the doctype
 * @returns DocType configuration
 * @throws Error if doctype not found
 */
export function getDocType<T extends Record<string, unknown>>(
  name: string
): DocTypeConfig<T> {
  const config = registry.get(name);

  if (!config) {
    throw new Error(
      `DocType '${name}' not found. Did you forget to register it?`
    );
  }

  return config as DocTypeConfig<T>;
}

/**
 * Get a doctype configuration by name (safe version)
 *
 * @template T The type of the doctype
 * @param name Name of the doctype
 * @returns DocType configuration or null if not found
 */
export function getDocTypeSafe<T extends Record<string, unknown>>(
  name: string
): DocTypeConfig<T> | null {
  const config = registry.get(name);
  return config ? (config as DocTypeConfig<T>) : null;
}

/**
 * Check if a doctype is registered
 *
 * @param name Name of the doctype
 * @returns True if registered, false otherwise
 */
export function hasDocType(name: string): boolean {
  return registry.has(name);
}

/**
 * Get all registered doctype configurations
 *
 * @returns Array of all registered doctype configurations
 */
export function getAllDocTypes(): DocTypeConfig<any>[] {
  return Array.from(registry.values());
}

/**
 * Get all registered doctype names
 *
 * @returns Array of all registered doctype names
 */
export function getAllDocTypeNames(): string[] {
  return Array.from(registry.keys());
}

/**
 * Unregister a doctype
 *
 * @param name Name of the doctype to unregister
 * @returns True if doctype was unregistered, false if not found
 */
export function unregisterDocType(name: string): boolean {
  if (!registry.has(name)) {
    console.warn(`DocType '${name}' is not registered`);
    return false;
  }

  registry.delete(name);
  console.log(`✅ DocType '${name}' unregistered successfully`);
  return true;
}

/**
 * Clear all registered doctypes
 * Useful for testing
 */
export function clearRegistry(): void {
  registry.clear();
  console.log("✅ DocType registry cleared");
}

/**
 * Get registry statistics
 */
export function getRegistryStats(): {
  total: number;
  names: string[];
} {
  return {
    total: registry.size,
    names: getAllDocTypeNames(),
  };
}
