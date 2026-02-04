// src/app/users/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import UserList from "@/components/users/UserList";

export const metadata = {
  title: "Users - EKA+ Admin",
  description: "Kelola pengguna aplikasi EKA+",
};

export default function UsersPage() {
  return (
    <RequireAuth permissions={["users.view", "users.view_branch"]}>
      <UserList />
    </RequireAuth>
  );
}
