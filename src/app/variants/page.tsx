// src/app/variants/page.tsx
import VariantList from '@/components/variants/VariantList';

export const metadata = {
  title: 'Variant Mappings - Mapping Item ke Product',
  description: 'Kelola mapping antara items dan products',
};

export default function VariantsPage() {
  return (
    <div className="space-y-6">
      <VariantList />
    </div>
  );
}