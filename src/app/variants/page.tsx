// src/app/variants/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import VariantList from "@/components/variants/VariantList";

export const metadata = {
  title: "Variant Mappings - Mapping Item ke Product",
  description: "Kelola mapping antara items dan products",
};

export default function VariantsPage() {
  return (
    <RequireAuth>
      <VariantList />
    </RequireAuth>
  );
}
