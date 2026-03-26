// src/app/permissions/page.tsx
import PermissionList from "@/components/permissions/PermissionList";
import RequireAuth from "@/components/auth/RequireAuth";

export default function PermissionsPage() {
  return (
    <RequireAuth>
      <PermissionList />
    </RequireAuth>
  );
}
