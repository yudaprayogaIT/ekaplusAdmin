// src/app/emails/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import EmailLogList from "@/components/emails/EmailLogList";

export const metadata = {
  title: "Email Logs - EKA+",
  description: "Riwayat dan status pengiriman email sistem",
};

export default function EmailsPage() {
  return (
    <RequireAuth permission="emails.view">
      <EmailLogList />
    </RequireAuth>
  );
}
