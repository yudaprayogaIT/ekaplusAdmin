import RequireAuth from "@/components/auth/RequireAuth";
import GPList from "@/components/group_party/GPList";

export const metadata = {
  title: "Group Party (GP) - EKA+ Web Admin",
  description: "Manage Group Party data",
};

export default function GPPage() {
  return (
    <RequireAuth permission="customer.view">
      <GPList />
    </RequireAuth>
  );
}
