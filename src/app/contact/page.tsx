import RequireAuth from "@/components/auth/RequireAuth";
import ContactPage from "@/components/contacts/ContactPage";

export const metadata = {
  title: "Contact - EKA+",
  description: "Kelola contact master dan identitas contact",
};

export default function CustomersContactPage() {
  return (
    <RequireAuth>
      <ContactPage />
    </RequireAuth>
  );
}
