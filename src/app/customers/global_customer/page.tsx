import RequireAuth from "@/components/auth/RequireAuth";
import GCList from "@/components/global_customer/GCList";

export const metadata = {
  title: "Global Customer (GC) - EKA+ Web Admin",
  description: "Manage Global Customer data - company-level customer",
};

export default function GCPage() {
  return (
    <RequireAuth permission="customer.view">
      <GCList />
    </RequireAuth>
  );
}
