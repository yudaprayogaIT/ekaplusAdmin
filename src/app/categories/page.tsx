// src/app/categories/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import CategoryList from "@/components/categories/CategoryList";

export const metadata = {
  title: "Categories - Kategori Barang Ekatalog Ekatunggal",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <RequireAuth>
        <CategoryList />
      </RequireAuth>
    </div>
  );
}
