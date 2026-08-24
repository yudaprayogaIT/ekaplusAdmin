// src/app/types/page.tsx

import { Suspense } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import TypeList from "@/components/types/Typelist";

export const metadata = {
  title: "Item Types - EKA+",
  description: "Kelola tipe item untuk kategori produk",
};

export default function TypesPage() {
  return (
    <RequireAuth>
      <Suspense fallback={null}>
        <TypeList />
      </Suspense>
    </RequireAuth>
  );
}
