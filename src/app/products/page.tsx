// src/app/products/page.tsx
import ProductList from '@/components/products/ProductList';

export const metadata = {
  title: 'Products - Produk Ekatalog Ekatunggal',
  description: 'Kelola produk dengan varian material dan furniture',
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <ProductList />
    </div>
  );
}