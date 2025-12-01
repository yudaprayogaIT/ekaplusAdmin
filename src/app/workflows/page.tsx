// src/app/workflows/page.tsx

import WorkflowList from "@/components/workflows/WorkflowList";

export const metadata = {
  title: 'Workflows - EKA+ Admin',
  description: 'Kelola workflow dan approval process',
};

export default function WorkflowsPage() {
  return <WorkflowList />;
}