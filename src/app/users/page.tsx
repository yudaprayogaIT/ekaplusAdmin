// src/app/users/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import { RoleGate } from "@/components/auth/PermissionGate";
import UserList from "@/components/users/UserList";

export const metadata = {
  title: "Users - EKA+ Admin",
  description: "Kelola pengguna aplikasi EKA+",
};

export default function UsersPage() {
  return (
    <RequireAuth>
      <RoleGate roles={["administrator"]} showLocked>
        <UserList />
      </RoleGate>
    </RequireAuth>
  );
}
