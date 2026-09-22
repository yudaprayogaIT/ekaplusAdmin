// src/app/banners/page.tsx
"use client";

import { Suspense } from "react";
import BannerList from "@/components/banners/BannerList";

export default function BannersPage() {
  return (
    <Suspense fallback={null}>
      <BannerList />
    </Suspense>
  );
}
