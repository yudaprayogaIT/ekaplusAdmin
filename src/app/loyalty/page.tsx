import RequireAuth from "@/components/auth/RequireAuth";
import { LoyaltyDashboard } from "@/components/loyalty/DashboardAndBalance";
import { LoyaltyShell } from "@/components/loyalty/LoyaltyUI";
export const metadata = { title: "Loyalty Dashboard - EKA+" };
export default function Page() { return <RequireAuth><LoyaltyShell title="Dashboard Loyalty" description="Ringkasan aktivitas loyalty dan akses cepat untuk operasional harian."><LoyaltyDashboard/></LoyaltyShell></RequireAuth>; }
