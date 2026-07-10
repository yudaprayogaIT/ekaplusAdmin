"use client";

export const OPEN_LOGIN_MODAL_EVENT = "ekaplus:open-login-modal";

export function dispatchOpenLoginModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_LOGIN_MODAL_EVENT));
}
