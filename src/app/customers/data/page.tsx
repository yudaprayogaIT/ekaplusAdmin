import RequireAuth from "@/components/auth/RequireAuth";
import CustomerDataPage from "@/components/customers/CustomerDataPage";

export const metadata = {
  title: "Data Customer - EKA+ Web Admin",
  description: "Profil customer lengkap dalam satu halaman",
};

export default function DataCustomerPage() {
  return (
    <RequireAuth>
      <CustomerDataPage />
    </RequireAuth>
  );
}
