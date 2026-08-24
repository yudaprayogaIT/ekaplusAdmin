import { Suspense } from "react";
import { notFound } from "next/navigation";
import RequireAuth from "@/components/auth/RequireAuth";
import CustomerOverviewPage from "@/components/customers/CustomerOverviewPage";

const CUSTOMER_TYPES = new Set(["bc", "nb", "gp", "gc"]);
export const dynamicParams = false;

export function generateStaticParams() {
  return ["bc", "nb", "gp", "gc"].map((type) => ({ type }));
}

export default async function CustomerTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!CUSTOMER_TYPES.has(type)) notFound();

  return (
    <RequireAuth>
      <Suspense fallback={null}>
        <CustomerOverviewPage />
      </Suspense>
    </RequireAuth>
  );
}
