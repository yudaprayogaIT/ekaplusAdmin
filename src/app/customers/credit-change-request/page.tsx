import { Suspense } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { CreditChangeRequestList } from "@/components/customers/credit-change-request/CreditChangeRequestList";

export const metadata = {
  title: "Credit Change Request - Ekatunggal",
  description: "Kelola pengajuan perubahan credit customer",
};

export default function CreditChangeRequestPage() {
  return (
    <RequireAuth>
      <Suspense fallback={null}>
        <CreditChangeRequestList />
      </Suspense>
    </RequireAuth>
  );
}
