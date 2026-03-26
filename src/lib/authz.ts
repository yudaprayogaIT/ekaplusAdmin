"use client";

export type PermissionEffect = "allow" | "deny";
export type PermissionScopeType = "all" | "branch" | "own";

export type PermissionRule = {
  slug: string;
  resource: string;
  action: string;
  effect: PermissionEffect;
  scopeType: PermissionScopeType;
  scopeValue: string | null;
};

const ACTION_ALIASES: Record<string, string> = {
  view: "read",
  read: "read",
  list: "read",
  create: "create",
  add: "create",
  new: "create",
  update: "update",
  edit: "update",
  write: "update",
  delete: "delete",
  remove: "delete",
  destroy: "delete",
  assign: "assign",
  export: "export",
  approve: "approve",
  reject: "reject",
  submit: "submit",
};

function normalizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/[/:]+/g, ".")
    .replace(/\.+/g, ".");
}

export function normalizeActionToken(value: string): string {
  const token = normalizeToken(value).replace(/\./g, "_");
  return ACTION_ALIASES[token] || token;
}

export function normalizeResourceToken(value: string): string {
  return normalizeToken(value).replace(/\./g, "_");
}

function singularizeResourceToken(resource: string): string {
  if (resource.endsWith("ies")) {
    return `${resource.slice(0, -3)}y`;
  }
  if (resource.endsWith("ses")) {
    return resource.slice(0, -2);
  }
  if (resource.endsWith("s") && !resource.endsWith("ss")) {
    return resource.slice(0, -1);
  }
  return resource;
}

function pluralizeResourceToken(resource: string): string {
  if (resource.endsWith("y")) {
    return `${resource.slice(0, -1)}ies`;
  }
  if (resource.endsWith("s")) {
    return resource;
  }
  return `${resource}s`;
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

export function buildPermissionSlug(resource: string, action: string): string {
  return `${singularizeResourceToken(normalizeResourceToken(resource))}.${normalizeActionToken(action)}`;
}

export function normalizePermissionSlug(permission: string): string {
  const token = normalizeToken(permission);
  const [resource, action] = token.split(".");
  if (!resource || !action) return token.replace(/\./g, "_");
  return buildPermissionSlug(resource, action);
}

export function expandPermissionCandidates(permission: string): string[] {
  const token = normalizeToken(permission);
  const [resourcePart, actionPart] = token.split(".");
  if (!resourcePart || !actionPart) return uniqueStrings([token]);

  const actionTokens = uniqueStrings([actionPart, normalizeActionToken(actionPart)]);
  const resource = normalizeResourceToken(resourcePart);
  const resources = uniqueStrings([
    resource,
    singularizeResourceToken(resource),
    pluralizeResourceToken(resource),
  ]);

  const candidates: string[] = [];
  for (const resourceToken of resources) {
    for (const actionToken of actionTokens) {
      candidates.push(`${resourceToken}.${actionToken}`);
    }
  }

  candidates.push(buildPermissionSlug(resource, actionPart));
  return uniqueStrings(candidates);
}

function normalizeEffect(value: unknown): PermissionEffect {
  if (typeof value === "string" && value.trim().toLowerCase() === "deny") {
    return "deny";
  }
  if (value === false || value === 0 || value === "0") {
    return "deny";
  }
  return "allow";
}

function normalizeScopeType(value: unknown): PermissionScopeType {
  const token = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (token === "branch") return "branch";
  if (token === "own") return "own";
  return "all";
}

function createRule(
  resource: string,
  action: string,
  effect: PermissionEffect,
  scopeType: PermissionScopeType,
  scopeValue: string | null,
): PermissionRule {
  const normalizedResource = normalizeResourceToken(resource);
  const normalizedAction = normalizeActionToken(action);

  return {
    slug: buildPermissionSlug(normalizedResource, normalizedAction),
    resource: singularizeResourceToken(normalizedResource),
    action: normalizedAction,
    effect,
    scopeType,
    scopeValue,
  };
}

function parseFlatPermission(
  value: string,
  effect: PermissionEffect,
  scopeType: PermissionScopeType,
  scopeValue: string | null,
): PermissionRule[] {
  const token = normalizeToken(value);
  const [resource, action] = token.split(".");
  if (!resource || !action) return [];
  return [createRule(resource, action, effect, scopeType, scopeValue)];
}

function parseRuleObject(input: Record<string, unknown>): PermissionRule[] {
  const effect = normalizeEffect(input.effect ?? input.allow);
  const scopeType = normalizeScopeType(
    input.scope_type ?? input.scopeType ?? input.scope,
  );
  const scopeValue =
    input.scope_value ??
    input.scopeValue ??
    input.branch_id ??
    input.branchId ??
    null;
  const normalizedScopeValue =
    scopeValue === null || scopeValue === undefined ? null : String(scopeValue);

  const flatSlugFields = [
    input.permission_slug,
    input.permissionSlug,
    input.slug,
    input.key,
  ].filter((value): value is string => typeof value === "string" && value.includes("."));

  if (flatSlugFields.length > 0) {
    return flatSlugFields.flatMap((value) =>
      parseFlatPermission(value, effect, scopeType, normalizedScopeValue),
    );
  }

  const resource =
    input.resource_slug ??
    input.resourceSlug ??
    input.resource_name ??
    input.resourceName ??
    input.resource ??
    input.doctype ??
    null;

  const action =
    input.action ??
    input.permission ??
    input.permission_name ??
    input.permissionName ??
    input.name ??
    null;

  if (typeof resource === "string" && Array.isArray(input.actions)) {
    return input.actions.flatMap((item) =>
      typeof item === "string"
        ? [createRule(resource, item, effect, scopeType, normalizedScopeValue)]
        : [],
    );
  }

  if (typeof resource === "string" && Array.isArray(input.permissions)) {
    return input.permissions.flatMap((item) => {
      if (typeof item === "string") {
        return item.includes(".")
          ? parseFlatPermission(item, effect, scopeType, normalizedScopeValue)
          : [createRule(resource, item, effect, scopeType, normalizedScopeValue)];
      }
      if (item && typeof item === "object") {
        return extractPermissionRules(item);
      }
      return [];
    });
  }

  if (typeof resource === "string" && typeof action === "string") {
    return [createRule(resource, action, effect, scopeType, normalizedScopeValue)];
  }

  return [];
}

export function extractPermissionRules(input: unknown): PermissionRule[] {
  if (!input) return [];

  if (typeof input === "string") {
    return parseFlatPermission(input, "allow", "all", null);
  }

  if (Array.isArray(input)) {
    return input.flatMap((item) => extractPermissionRules(item));
  }

  if (typeof input !== "object") {
    return [];
  }

  const record = input as Record<string, unknown>;
  const directRules = parseRuleObject(record);
  const nestedKeys = [
    "permissions",
    "permission_slugs",
    "permissionSlugs",
    "permission_rules",
    "permissionRules",
    "role_permissions",
    "rolePermissions",
    "items",
  ];

  const nestedRules = nestedKeys.flatMap((key) => extractPermissionRules(record[key]));
  return dedupePermissionRules([...directRules, ...nestedRules]);
}

export function dedupePermissionRules(rules: PermissionRule[]): PermissionRule[] {
  const seen = new Set<string>();
  const result: PermissionRule[] = [];

  for (const rule of rules) {
    const key = [
      rule.slug,
      rule.effect,
      rule.scopeType,
      rule.scopeValue || "",
    ].join("|");

    if (seen.has(key)) continue;
    seen.add(key);
    result.push(rule);
  }

  return result;
}

export function deriveFlatPermissions(rules: PermissionRule[]): string[] {
  const deniedAll = new Set(
    rules
      .filter((rule) => rule.effect === "deny" && rule.scopeType === "all")
      .map((rule) => rule.slug),
  );

  return uniqueStrings(
    rules
      .filter((rule) => rule.effect === "allow")
      .map((rule) => rule.slug)
      .filter((slug) => !deniedAll.has(slug)),
  );
}
