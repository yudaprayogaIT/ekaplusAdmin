// src/app/products/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import ProductList from "@/components/products/ProductList";

export const metadata = {
  title: "Products - EKA+",
  description: "Kelola produk dengan varian material dan furniture",
};

export default function ProductsPage() {
  return (
    <RequireAuth>
      <ProductList />
    </RequireAuth>
  );
}
