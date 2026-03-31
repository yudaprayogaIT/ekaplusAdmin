import RequireAuth from "@/components/auth/RequireAuth";
import { CustomerLimitList } from "@/components/customers/limit/CustomerLimitList";

export const metadata = {
  title: "Customer Limit - Ekatunggal",
  description: "Kelola pengajuan customer limit",
};

export default function CustomerLimitPage() {
  return (
    <RequireAuth>
      <CustomerLimitList />
    </RequireAuth>
  );
}
