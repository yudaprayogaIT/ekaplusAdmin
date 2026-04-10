import RequireAuth from "@/components/auth/RequireAuth";
import ResourceList from "@/components/resources/ResourceList";

export default function ResourcesPage() {
  return (
    <RequireAuth>
      <ResourceList />
    </RequireAuth>
  );
}
