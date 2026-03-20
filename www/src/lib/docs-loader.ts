import matter from "gray-matter";

export interface DocPage {
  slug: string;
  title: string;
  description?: string;
  content: string;
  path: string;
  order?: number;
}

export interface DocSection {
  name: string;
  slug: string;
  pages: DocPage[];
}

// Import all markdown files from /docs at build time
// Use relative path from www/src/lib to cambrian/docs
const docsModules = import.meta.glob("../../../docs/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function slugFromPath(path: string): string {
  // "../../../docs/architecture.md" -> "architecture"
  // "../../../docs/cip/cip-01-core.md" -> "cip/cip-01-core"
  return path
    .replace(/^.*\/docs\//, "")
    .replace(/\.md$/, "")
    .replace(/\/README$/i, ""); // README files become index of folder
}

function titleFromSlug(slug: string): string {
  const basename = slug.split("/").pop() || slug;
  return basename
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseDoc(path: string, raw: string): DocPage {
  const { data, content } = matter(raw);
  const slug = slugFromPath(path);

  return {
    slug,
    title: data.title || titleFromSlug(slug) || "Documentation",
    description: data.description,
    content,
    path,
    order: data.order,
  };
}

// Parse all docs
const allDocs: DocPage[] = Object.entries(docsModules).map(([path, content]) =>
  parseDoc(path, content)
);

// Sort docs by order, then alphabetically
allDocs.sort((a, b) => {
  if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
  if (a.order !== undefined) return -1;
  if (b.order !== undefined) return 1;
  return a.slug.localeCompare(b.slug);
});

export function getDocBySlug(slug: string): DocPage | undefined {
  // Normalize: empty slug means README
  const normalizedSlug = slug === "" ? "README" : slug;
  return allDocs.find((doc) => doc.slug === normalizedSlug || doc.slug === slug);
}

export function getAllDocs(): DocPage[] {
  return allDocs;
}

export function getDocSections(): DocSection[] {
  const sections: Record<string, DocSection> = {};
  const rootPages: DocPage[] = [];

  for (const doc of allDocs) {
    const parts = doc.slug.split("/");
    if (parts.length === 1) {
      // Root level doc
      rootPages.push(doc);
    } else {
      // Nested doc
      const sectionSlug = parts[0];
      if (!sections[sectionSlug]) {
        sections[sectionSlug] = {
          name: titleFromSlug(sectionSlug),
          slug: sectionSlug,
          pages: [],
        };
      }
      sections[sectionSlug].pages.push(doc);
    }
  }

  // Return root pages as "Getting Started" section + other sections
  const result: DocSection[] = [];

  if (rootPages.length > 0) {
    result.push({
      name: "Documentation",
      slug: "",
      pages: rootPages,
    });
  }

  result.push(...Object.values(sections));

  return result;
}
