// src/app/whatsapp/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import WhatsAppDeviceList from "@/components/whatsapp/WhatsAppDeviceList";

export const metadata = {
  title: "WhatsApp Admin - EKA+",
  description: "Kelola perangkat WhatsApp untuk pengiriman OTP dan notifikasi",
};

export default function WhatsAppPage() {
  return (
    <RequireAuth>
      <WhatsAppDeviceList />
    </RequireAuth>
  );
}
