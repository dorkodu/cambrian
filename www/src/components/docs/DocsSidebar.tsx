import { getDocSections, type DocSection } from "@/lib/docs-loader";
import { cn } from "@/lib/utils";
import { IconChevronDown } from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";

function SectionItem({ section }: { section: DocSection }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4">
      {section.slug !== "" && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-md"
        >
          {section.name}
          <IconChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
      )}

      {(isOpen || section.slug === "") && (
        <ul className={cn("space-y-1", section.slug !== "" && "mt-1 ml-2")}>
          {section.pages.map((page) => {
            const href = page.slug === "README" ? "/docs" : `/docs/${page.slug}`;
            const isPageActive =
              location.pathname === href ||
              (page.slug === "README" && location.pathname === "/docs");

            return (
              <li key={page.slug}>
                <Link
                  to={href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    isPageActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {page.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function DocsSidebar() {
  const sections = getDocSections();

  return (
    <nav className="space-y-2">
      {sections.map((section) => (
        <SectionItem key={section.slug || "root"} section={section} />
      ))}
    </nav>
  );
}
