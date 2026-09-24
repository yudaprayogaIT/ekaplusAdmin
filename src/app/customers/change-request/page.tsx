import { Suspense } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { CustomerChangeRequestList } from "@/components/customers/change-request/CustomerChangeRequestList";

export const metadata = {
  title: "Customer Change Request - Ekatunggal",
  description: "Daftar pengajuan perubahan data customer",
};

export default function CustomerChangeRequestPage() {
  return (
    <RequireAuth>
      <Suspense fallback={null}>
        <CustomerChangeRequestList />
      </Suspense>
    </RequireAuth>
  );
}
