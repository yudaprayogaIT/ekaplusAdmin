// src/app/items/page.tsx
import ItemList from '@/components/items/ItemList';

export const metadata = {
  title: 'Items - Ekatalog Ekatunggal',
  description: 'Kelola item produk di seluruh cabang',
};

export default function ItemsPage() {
  return <ItemList />;
}