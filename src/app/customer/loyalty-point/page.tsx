import { Suspense } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import LoyaltyPointModule from "@/components/loyalty/LoyaltyPointModule";

export const metadata = { title: "Loyalty Point - EKA+ Admin" };
export default function Page() { return <RequireAuth><Suspense fallback={null}><LoyaltyPointModule /></Suspense></RequireAuth>; }
