import RequireAuth from "@/components/auth/RequireAuth";
import GPList from "@/components/global_party/GPList";

export const metadata = {
  title: "Global Party (GP) - EKA+ Web Admin",
  description: "Manage Global Party data - unique business entities",
};

export default function GPPage() {
  return (
    <RequireAuth permission="customer.view">
      <GPList />
    </RequireAuth>
  );
}
