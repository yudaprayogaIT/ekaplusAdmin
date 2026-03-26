// src/app/roles/page.tsx
"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import RoleList from "@/components/roles/RoleList";

export default function RolesPage() {
  return (
    <RequireAuth>
      <RoleList />
    </RequireAuth>
  );
}
