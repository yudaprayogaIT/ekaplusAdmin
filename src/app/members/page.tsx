import { MemberList } from "@/components/members/MemberList";

export const metadata = {
  title: "Members - Ekatalog Admin",
  description: "Manage all members (GP/GC/BC) in one unified view",
};

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MemberList />
    </div>
  );
}
