"use client";

import { usePathname, useSearchParams } from "next/navigation";
import LoyaltyOverview from "./LoyaltyOverview";
import { CustomerPointDetail, CustomerPointsList } from "./LoyaltyCustomers";
import { CalculationDetail, CalculationList } from "./LoyaltyCalculations";
import { RedemptionDetail, RedemptionList } from "./LoyaltyRedemptions";
import LoyaltySettings, { type SettingsSection } from "./LoyaltySettings";
import { LoyaltyShell } from "./LoyaltyUI";

export default function LoyaltyPointModule() {
  const pathname = usePathname() || "/customer/loyalty-point";
  const searchParams = useSearchParams();
  let title = "Loyalty Point";
  let description = "Monitor dan kelola loyalty point Group Parent.";
  let content = <LoyaltyOverview />;

  if (pathname.endsWith("/customers/detail")) {
    const gpid = searchParams.get("gpid") ?? "";
    title = "Customer Point Detail";
    description =
      "Saldo, alokasi point, calculation, dan redemption Group Parent.";
    content = <CustomerPointDetail gpid={gpid} />;
  } else if (pathname.endsWith("/customers")) {
    title = "Customer Points";
    description = "Lihat saldo loyalty point berdasarkan Group Parent.";
    content = <CustomerPointsList />;
  } else if (pathname.endsWith("/calculations/detail")) {
    const id = searchParams.get("id") ?? "";
    const calculationOnly = searchParams.get("type") === "calculation";
    title = calculationOnly ? `Calculation ${id}` : `Calculation Batch #${id}`;
    description = calculationOnly
      ? "Detail perhitungan point customer."
      : "Monitoring hasil kalkulasi per Group Parent.";
    content = <CalculationDetail id={id} calculationOnly={calculationOnly} />;
  } else if (pathname.endsWith("/calculations")) {
    title = "Calculation";
    description = "Monitor dan jalankan batch kalkulasi loyalty point.";
    content = <CalculationList />;
  } else if (pathname.endsWith("/redemptions/detail")) {
    const id = searchParams.get("id") ?? "";
    title = `Redemption ${id}`;
    description = "Detail dan proses approval redemption.";
    content = <RedemptionDetail id={id} />;
  } else if (pathname.endsWith("/redemptions")) {
    title = "Redemption";
    description = "Lihat seluruh transaksi penukaran loyalty point.";
    content = <RedemptionList />;
  } else if (pathname.includes("/settings")) {
    const rawSection = pathname.split("/").filter(Boolean).at(-1) ?? "periods";
    const section: SettingsSection = ["periods", "rules", "rewards"].includes(
      rawSection,
    )
      ? (rawSection as SettingsSection)
      : "periods";
    title = "Loyalty Settings";
    description = "Kelola period, point rule, standard divider, dan reward.";
    content = <LoyaltySettings section={section} />;
  }

  return (
    <LoyaltyShell pathname={pathname} title={title} description={description}>
      {content}
    </LoyaltyShell>
  );
}
