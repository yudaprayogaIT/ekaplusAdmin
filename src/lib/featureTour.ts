"use client";

export const FEATURE_TOUR_PENDING_CHANGED_EVENT =
  "ekaplus:feature-tour-pending-changed";

export type FeatureTourStep =
  | "menu"
  | "profile-menu"
  | "edit"
  | "photo"
  | "form"
  | "save"
  | "password";

export type FeatureTourConfig = {
  debugEnabled: boolean;
  pendingKey: string;
  followUpKey: string;
  seenKey: string;
};

export const profileFeatureTourConfig: FeatureTourConfig = {
  debugEnabled:
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_PROFILE_TOUR_DEBUG === "true",
  pendingKey: "ekaplus-profile-feature-tour-pending",
  followUpKey: "ekaplus-profile-feature-tour-follow-up",
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
  window.sessionStorage.removeItem(config.followUpKey);
  window.dispatchEvent(new CustomEvent(FEATURE_TOUR_PENDING_CHANGED_EVENT));
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
  window.dispatchEvent(new CustomEvent(FEATURE_TOUR_PENDING_CHANGED_EVENT));
}

export function clearPendingFeatureTourStep(config: FeatureTourConfig) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(config.pendingKey);
  window.dispatchEvent(new CustomEvent(FEATURE_TOUR_PENDING_CHANGED_EVENT));
}

export function getFeatureTourFollowUpStep(
  config: FeatureTourConfig,
): FeatureTourStep | null {
  if (typeof window === "undefined") return null;
  const step = window.sessionStorage.getItem(config.followUpKey);
  return isFeatureTourStep(step) ? step : null;
}

export function setFeatureTourFollowUpStep(
  config: FeatureTourConfig,
  step: FeatureTourStep,
) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(config.followUpKey, step);
  window.dispatchEvent(new CustomEvent(FEATURE_TOUR_PENDING_CHANGED_EVENT));
}

export function clearFeatureTourFollowUpStep(config: FeatureTourConfig) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(config.followUpKey);
  window.dispatchEvent(new CustomEvent(FEATURE_TOUR_PENDING_CHANGED_EVENT));
}

function isFeatureTourStep(value: string | null): value is FeatureTourStep {
  return (
    value === "menu" ||
    value === "profile-menu" ||
    value === "edit" ||
    value === "photo" ||
    value === "form" ||
    value === "save" ||
    value === "password"
  );
}
