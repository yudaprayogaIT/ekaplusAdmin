import RequireAuth from "@/components/auth/RequireAuth";
import { BalanceLookup } from "@/components/loyalty/DashboardAndBalance";
import { LoyaltyShell } from "@/components/loyalty/LoyaltyUI";
export default function Page() { return <RequireAuth><LoyaltyShell title="Saldo Poin" description="Periksa saldo resmi Group Parent melalui konteks GP atau Branch Customer."><BalanceLookup/></LoyaltyShell></RequireAuth>; }
