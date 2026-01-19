// src/app/branches/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import BranchList from "@/components/branches/BranchList";

export const metadata = {
  title: "Branches - EKA+ Admin",
  description: "Kelola cabang Ekatunggal di seluruh Indonesia",
};

export default function BranchesPage() {
  return (
    <RequireAuth permission="branches.view">
      <BranchList />
    </RequireAuth>
  );
}
