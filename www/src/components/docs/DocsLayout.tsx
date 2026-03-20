import { IconMenu2, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { DocsSidebar } from "./DocsSidebar";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex gap-8 py-8">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg lg:hidden"
          aria-label="Open navigation"
        >
          <IconMenu2 className="h-6 w-6" />
        </button>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72 transform overflow-y-auto border-r border-border bg-background p-6 transition-transform lg:relative lg:inset-auto lg:z-0 lg:block lg:w-64 lg:shrink-0 lg:transform-none lg:border-r-0 lg:p-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Mobile close button */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <span className="font-semibold">Navigation</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1 hover:bg-muted"
              aria-label="Close navigation"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          <div className="sticky top-24">
            <DocsSidebar />
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <article className="max-w-3xl">{children}</article>
        </main>
      </div>
    </div>
  );
}
