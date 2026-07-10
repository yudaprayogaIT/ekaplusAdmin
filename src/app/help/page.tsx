import RequireAuth from "@/components/auth/RequireAuth";
import HelpCenterPage from "@/components/help/HelpCenterPage";

export const metadata = {
  title: "Help - EKA+ Admin",
  description: "Pusat bantuan dan tour interaktif EKA+ Admin",
};

export default function HelpPage() {
  return (
    <RequireAuth>
      <HelpCenterPage />
    </RequireAuth>
  );
}
