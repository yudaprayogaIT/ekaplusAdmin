// src/app/workflows/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import WorkflowList from "@/components/workflows/WorkflowList";

export default function WorkflowsPage() {
  return (
    <RequireAuth>
      <WorkflowList />
    </RequireAuth>
  );
}
