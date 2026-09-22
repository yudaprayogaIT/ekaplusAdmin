"use client";

const LOGIN_REDIRECT_KEY = "ekaplus_login_redirect";

function isSafeInternalPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

export function rememberLoginRedirect(path: string) {
  if (typeof window === "undefined" || !isSafeInternalPath(path)) return;

  window.sessionStorage.setItem(LOGIN_REDIRECT_KEY, path);
}

export function consumeLoginRedirect(): string | null {
  if (typeof window === "undefined") return null;

  const path = window.sessionStorage.getItem(LOGIN_REDIRECT_KEY);
  window.sessionStorage.removeItem(LOGIN_REDIRECT_KEY);

  return path && isSafeInternalPath(path) ? path : null;
}
