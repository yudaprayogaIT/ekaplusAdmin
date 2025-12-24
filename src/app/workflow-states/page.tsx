// src/app/workflow-states/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import WorkflowStateList from "@/components/workflow-states/WorkflowStateList";

export const metadata = {
  title: "Workflow States - EKA+ Admin",
  description: "Kelola state untuk workflow system",
};

export default function WorkflowStatesPage() {
  return (
    <RequireAuth>
      <WorkflowStateList />
    </RequireAuth>
  );
}
