// src/app/types/page.tsx

import RequireAuth from "@/components/auth/RequireAuth";
import TypeList from "@/components/types/Typelist";

export const metadata = {
  title: "Item Types - EKA+",
  description: "Kelola tipe item untuk kategori produk",
};

export default function TypesPage() {
  return (
    <RequireAuth>
      <TypeList />
    </RequireAuth>
  );
}
