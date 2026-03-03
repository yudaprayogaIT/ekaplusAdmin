import RequireAuth from "@/components/auth/RequireAuth";
import GCList from "@/components/group_customer/GCList";

export const metadata = {
  title: "Group Customer (GC) - EKA+ Web Admin",
  description: "Manage Group Customer data",
};

export default function GCPage() {
  return (
    <RequireAuth permission="customer.view">
      <GCList />
    </RequireAuth>
  );
}
