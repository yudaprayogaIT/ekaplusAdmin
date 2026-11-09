import RequireAuth from "@/components/auth/RequireAuth";
import { LoyaltyShell } from "@/components/loyalty/LoyaltyUI";
import { Redemptions } from "@/components/loyalty/Redemptions";
export default function Page() { return <RequireAuth><LoyaltyShell title="Penukaran Reward" description="Pantau approval, fulfillment, dan histori status redemption."><Redemptions/></LoyaltyShell></RequireAuth>; }
