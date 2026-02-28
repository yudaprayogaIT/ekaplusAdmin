import RequireAuth from "@/components/auth/RequireAuth";
import NBList from "@/components/national_brand/NBList";

export const metadata = {
  title: "National Brand - EKA+ Web Admin",
  description: "Manage National Brand data",
};

export default function NationalBrandPage() {
  return (
    <RequireAuth permission="customer.view">
      <NBList />
    </RequireAuth>
  );
}
