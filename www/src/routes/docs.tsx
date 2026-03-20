import { DocsLayout } from "@/components/docs/DocsLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/docs")({
  component: DocsLayoutComponent,
  head: () => ({
    meta: [
      { title: "Documentation — Cambrian" },
      { name: "description", content: "Cambrian protocol documentation, specifications, and guides." },
    ],
  }),
});

function DocsLayoutComponent() {
  return (
    <DocsLayout>
      <Outlet />
    </DocsLayout>
  );
}
