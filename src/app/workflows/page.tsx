// src/app/workflows/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import { RoleGate } from "@/components/auth/PermissionGate";
import WorkflowList from "@/components/workflows/WorkflowList";

export default function WorkflowsPage() {
  return (
    <RequireAuth>
      <RoleGate roles={["administrator"]} showLocked>
        <WorkflowList />
      </RoleGate>
    </RequireAuth>
  );
}
