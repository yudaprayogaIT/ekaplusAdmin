import RequireAuth from "@/components/auth/RequireAuth";
import { LoyaltyShell } from "@/components/loyalty/LoyaltyUI";
import { PeriodManager } from "@/components/loyalty/ResourcePages";
export default function Page() { return <RequireAuth><LoyaltyShell title="Periode Loyalty" description="Kelola periode perhitungan, kesiapan, dan masa berlaku poin."><PeriodManager/></LoyaltyShell></RequireAuth>; }
