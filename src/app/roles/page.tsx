// src/app/roles/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import RoleList from "@/components/roles/RoleList";

export const metadata = {
  title: "Roles & Permissions - EKA+ Admin",
  description: "Kelola role dan hak akses pengguna EKA+",
};

export default function RolesPage() {
  return (
    <RequireAuth permission="roles.view">
      <RoleList />
    </RequireAuth>
  );
}
