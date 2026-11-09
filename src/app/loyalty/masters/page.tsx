import RequireAuth from "@/components/auth/RequireAuth";
import { LoyaltyShell } from "@/components/loyalty/LoyaltyUI";
import { MasterManager } from "@/components/loyalty/ResourcePages";
export default function Page() { return <RequireAuth><LoyaltyShell title="Master Reward" description="Kelola tipe, kategori, dan partner reward."><MasterManager/></LoyaltyShell></RequireAuth>; }
