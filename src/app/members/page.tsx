import RequireAuth from "@/components/auth/RequireAuth";
import { MemberList } from "@/components/members/MemberList";

export const metadata = {
  title: "Members - Ekatalog Admin",
  description: "Manage member relations from member_of",
};

export default function MembersPage() {
  return (
    <RequireAuth permission="customer.view">
      <div className="min-h-screen bg-gray-50">
        <MemberList />
      </div>
    </RequireAuth>
  );
}
