import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";
import { getDocBySlug } from "@/lib/docs-loader";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/$")({
  component: DocsPage,
  head: ({ params }) => {
    const slug = params._splat || "";
    const doc = getDocBySlug(slug);
    return {
      meta: [
        { title: doc ? `${doc.title} — Cambrian Docs` : "Not Found — Cambrian Docs" },
        { name: "description", content: doc?.description || "Cambrian documentation page." },
      ],
    };
  },
});

function DocsPage() {
  const { _splat: slug = "" } = Route.useParams();
  const doc = getDocBySlug(slug);

  if (!doc) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The documentation page "{slug}" could not be found.
        </p>
      </div>
    );
  }

  return (
    <>
      <MarkdownRenderer content={doc.content} />
    </>
  );
}
