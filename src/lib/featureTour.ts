"use client";

export type FeatureTourStep = "menu" | "edit" | "photo" | "password";

export type FeatureTourConfig = {
  debugEnabled: boolean;
  pendingKey: string;
  seenKey: string;
};

export const profileFeatureTourConfig: FeatureTourConfig = {
  debugEnabled:
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_PROFILE_TOUR_DEBUG === "true",
  pendingKey: "ekaplus-profile-feature-tour-pending",
  seenKey: "ekaplus-profile-feature-tour-v2",
};

export function isFeatureTourSeen(config: FeatureTourConfig): boolean {
  if (typeof window === "undefined") return false;
  if (config.debugEnabled) return false;
  return window.localStorage.getItem(config.seenKey) === "seen";
}

export function markFeatureTourSeen(config: FeatureTourConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(config.seenKey, "seen");
  window.sessionStorage.removeItem(config.pendingKey);
}

export function getPendingFeatureTourStep(
  config: FeatureTourConfig,
): FeatureTourStep | null {
  if (typeof window === "undefined") return null;
  const step = window.sessionStorage.getItem(config.pendingKey);
  return isFeatureTourStep(step) ? step : null;
}

export function setPendingFeatureTourStep(
  config: FeatureTourConfig,
  step: FeatureTourStep,
) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(config.pendingKey, step);
}

export function clearPendingFeatureTourStep(config: FeatureTourConfig) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(config.pendingKey);
}

function isFeatureTourStep(value: string | null): value is FeatureTourStep {
  return value === "menu" || value === "edit" || value === "password";
}
