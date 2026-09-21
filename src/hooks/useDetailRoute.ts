"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Keeps a modal detail selection addressable without discarding list params. */
export function useDetailRoute() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchId = searchParams.get("id")?.trim() || null;
  const [detailRouteId, setDetailRouteId] = useState<string | null>(searchId);

  useEffect(() => {
    setDetailRouteId(searchId);
  }, [searchId]);

  useEffect(() => {
    const syncFromBrowser = () => {
      setDetailRouteId(
        new URLSearchParams(window.location.search).get("id")?.trim() || null,
      );
    };
    window.addEventListener("popstate", syncFromBrowser);
    return () => window.removeEventListener("popstate", syncFromBrowser);
  }, []);

  const openDetailRoute = useCallback(
    (id: string | number) => {
      const normalizedId = String(id);
      setDetailRouteId(normalizedId);
      const params = new URLSearchParams(window.location.search);
      params.set("id", normalizedId);
      window.history.pushState(
        { ...window.history.state, ekaModalBase: pathname },
        "",
        `${pathname}?${params.toString()}`,
      );
    },
    [pathname],
  );

  const closeDetailRoute = useCallback(() => {
    setDetailRouteId(null);
    if (window.history.state?.ekaModalBase === pathname) {
      window.history.back();
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.delete("id");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, router]);

  return { detailRouteId, openDetailRoute, closeDetailRoute };
}
