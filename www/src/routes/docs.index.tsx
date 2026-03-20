import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";
import { getDocBySlug } from "@/lib/docs-loader";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/")({
  component: DocsIndexPage,
  head: () => ({
    meta: [
      { title: "Documentation — Cambrian" },
      { name: "description", content: "Cambrian protocol documentation overview." },
    ],
  }),
});

function DocsIndexPage() {
  const doc = getDocBySlug("README");

  if (!doc) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Documentation</h1>
        <p className="mt-4 text-muted-foreground">
          No documentation found. Add markdown files to /docs to get started.
        </p>
      </div>
    );
  }

  return <MarkdownRenderer content={doc.content} />;
}
