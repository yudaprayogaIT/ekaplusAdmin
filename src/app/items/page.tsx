// src/app/items/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import ItemList from "@/components/items/ItemList";

export const metadata = {
  title: "Items - EKA+",
  description: "Kelola item produk di seluruh cabang",
};

export default function ItemsPage() {
  return (
    <RequireAuth>
      <ItemList />
    </RequireAuth>
  );
}
