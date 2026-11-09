import RequireAuth from "@/components/auth/RequireAuth";
import { LoyaltyShell } from "@/components/loyalty/LoyaltyUI";
import { Rewards } from "@/components/loyalty/Rewards";
export default function Page() { return <RequireAuth><LoyaltyShell title="Katalog Reward" description="Kelola katalog, konversi poin, stok, fulfillment, limit, dan publikasi reward."><Rewards/></LoyaltyShell></RequireAuth>; }
