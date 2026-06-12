import RequireAuth from "@/components/auth/RequireAuth";
import SalesTeamPage from "@/components/sales-team/SalesTeamPage";

export const metadata = {
  title: "Sales Team - EKA+ Admin",
  description: "Kelola sales team dan area cakupannya",
};

export default function SalesTeamsPage() {
  return (
    <RequireAuth>
      <SalesTeamPage />
    </RequireAuth>
  );
}
