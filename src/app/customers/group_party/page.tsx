import RequireAuth from "@/components/auth/RequireAuth";
import GPList from "@/components/group_parent/GPList";

export const metadata = {
  title: "Group Parent (GP) - EKA+ Web Admin",
  description: "Manage Group Parent data",
};

export default function GPPage() {
  return (
    <RequireAuth permission="customer.view">
      <GPList />
    </RequireAuth>
  );
}
