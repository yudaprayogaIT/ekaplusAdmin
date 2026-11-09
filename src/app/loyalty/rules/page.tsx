import RequireAuth from "@/components/auth/RequireAuth";
import { LoyaltyShell } from "@/components/loyalty/LoyaltyUI";
import { RuleManager } from "@/components/loyalty/ResourcePages";
export default function Page() { return <RequireAuth><LoyaltyShell title="Aturan Poin" description="Kelola aturan kalkulasi loyalty. Proteksi immutable tetap mengikuti backend."><RuleManager/></LoyaltyShell></RequireAuth>; }
