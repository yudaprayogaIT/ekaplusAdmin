import RequireAuth from "@/components/auth/RequireAuth";
import { Calculations } from "@/components/loyalty/Calculations";
import { LoyaltyShell } from "@/components/loyalty/LoyaltyUI";
export default function Page() { return <RequireAuth><LoyaltyShell title="Kalkulasi Poin" description="Jalankan kalkulasi dan pantau batch serta hasil per Group Parent."><Calculations/></LoyaltyShell></RequireAuth>; }
