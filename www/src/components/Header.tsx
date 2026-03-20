import { ThemeToggle } from "@/components/ThemeToggle";
import {
  IconBrandGithub,
  IconMenu2,
  IconX
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/cambrian_Logo_Light.svg"
              alt="Cambrian"
              className="h-8"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link to="/docs" className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Docs
            </Link>
            <a href="/#features" className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="/#architecture" className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Architecture
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <a
              href="https://github.com/dorkodu/cambrian"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <IconBrandGithub className="h-4 w-4" />
              GitHub
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Open menu"
          >
            <IconMenu2 className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-80 transform border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <img
              src="/images/cambrian_Logo_Light.svg"
              alt="Cambrian"
              className="h-6"
            />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close menu"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          <Link to="/docs" onClick={() => setIsOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
            Documentation
          </Link>
          <a href="/#features" onClick={() => setIsOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
            Features
          </a>
          <a href="/#architecture" onClick={() => setIsOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
            Architecture
          </a>

          <div className="mt-4 flex flex-col gap-2">
            <a
              href="https://github.com/dorkodu/cambrian"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <IconBrandGithub className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
}
