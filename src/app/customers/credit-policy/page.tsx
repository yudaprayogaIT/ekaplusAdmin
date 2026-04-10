import RequireAuth from "@/components/auth/RequireAuth";
import { CreditPolicyList } from "@/components/customers/credit-policy/CreditPolicyList";

export const metadata = {
  title: "Credit Policy - Ekatunggal",
  description: "Kelola credit policy berdasarkan entity customer",
};

export default function CreditPolicyPage() {
  return (
    <RequireAuth>
      <CreditPolicyList />
    </RequireAuth>
  );
}
