import { redirect } from "next/navigation";

export const metadata = {
  title: "Customers - EKA+ Web Admin",
  description: "Customer overview dashboard with account tabs",
};

export default function CustomersPage() {
  redirect("/customers/company/bc");
}
