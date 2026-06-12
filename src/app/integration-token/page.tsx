import RequireAuth from "@/components/auth/RequireAuth";
import IntegrationTokenPage from "@/components/integration-token/IntegrationTokenPage";

export const metadata = {
  title: "Integration Token - EKA+ Admin",
  description: "Kelola integration token untuk koneksi sistem eksternal",
};

export default function IntegrationTokenRoute() {
  return (
    <RequireAuth>
      <IntegrationTokenPage />
    </RequireAuth>
  );
}
