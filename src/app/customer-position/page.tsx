import RequireAuth from "@/components/auth/RequireAuth";
import CustomerPositionPage from "@/components/contacts/CustomerPositionPage";

export const metadata = {
  title: "Contact Position - EKA+",
  description: "Kelola posisi contact customer",
};

export default function CustomersContactPositionPage() {
  return (
    <RequireAuth>
      <CustomerPositionPage />
    </RequireAuth>
  );
}
