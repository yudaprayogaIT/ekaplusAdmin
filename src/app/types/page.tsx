// src/app/types/page.tsx

import TypeList from "@/components/types/Typelist";

export const metadata = {
  title: "Item Types - Tipe Item Ekatalog Ekatunggal",
  description: "Kelola tipe item untuk kategori produk",
};

export default function TypesPage() {
  return (
    <div className="space-y-6">
      <TypeList />
    </div>
  );
}
