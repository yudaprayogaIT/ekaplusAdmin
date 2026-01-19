import RequireAuth from "@/components/auth/RequireAuth";
import BranchCustomerList from "@/components/branch_customer/BCList";

export const metadata = {
  title: "Branch Customer (BC) - EKA+ Web Admin",
  description: "Manage Branch Customer data - branch-level customer",
};

export default function BranchCustomerPage() {
  return (
    <RequireAuth permission="customer.view">
      <BranchCustomerList />
    </RequireAuth>
  );
}
