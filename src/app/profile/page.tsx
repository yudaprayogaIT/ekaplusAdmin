import RequireAuth from "@/components/auth/RequireAuth";
import MyProfilePage from "@/components/profile/MyProfilePage";

export const metadata = {
  title: "Profil Saya - EKA+ Admin",
  description: "Lihat detail akun Anda di EKA+ Admin",
};

export default function ProfilePage() {
  return (
    <RequireAuth>
      <MyProfilePage />
    </RequireAuth>
  );
}
