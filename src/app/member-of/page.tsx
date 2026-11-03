import RequireAuth from "@/components/auth/RequireAuth";
import MemberOfPage from "@/components/member-of/MemberOfPage";

export const metadata = {
  title: "Member Of - EKA+ Admin",
  description: "Kelola akses user ke data customer EKA+",
};

export default function MemberOfRoute() {
  return (
    <RequireAuth>
      <MemberOfPage />
    </RequireAuth>
  );
}
