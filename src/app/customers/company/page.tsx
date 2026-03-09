import RequireAuth from "@/components/auth/RequireAuth";
import CustomerOverviewPage from "@/components/customers/CustomerOverviewPage";

export const metadata = {
  title: "Customers - EKA+ Web Admin",
  description: "Customer overview dashboard with account tabs",
};

export default function CustomersPage() {
  return (
    <RequireAuth permission="customer.view">
      <CustomerOverviewPage />
    </RequireAuth>
  );
}
