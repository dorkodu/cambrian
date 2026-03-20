import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconApps,
  IconBrain,
  IconBrandGithub,
  IconCloud,
  IconCloudOff,
  IconCode,
  IconExternalLink,
  IconGraph,
  IconKey,
  IconLink,
  IconRocket,
  IconSeedling,
  IconServer,
  IconTerminal2,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Cambrian — Decentralized Digital Garden Protocol" },
      { name: "description", content: "A local-first, AI-native protocol for building personal knowledge graphs. Built on Nostr." },
    ],
  }),
});

function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection />
      <DeliverablesSection />
      <CTASection />
      <Footer />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Status Badge */}
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Day 0 — Protocol Design Phase
          </Badge>

          {/* Title */}
          <img
            src="/images/cambrian_Logotype.svg"
            alt="Cambrian"
            className="mx-auto h-16 sm:h-20 lg:h-24"
          />

          {/* Tagline */}
          <p className="mt-4 text-xl font-medium text-muted-foreground sm:text-2xl">
            Decentralized Digital Garden Protocol
          </p>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A <strong className="text-foreground">local-first</strong>,{" "}
            <strong className="text-foreground">AI-native</strong> protocol for building
            personal knowledge graphs. Your thoughts, your keys, your network.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8">
              <IconRocket className="h-5 w-5" />
              Read the Docs
            </Button>
            <Button size="lg" variant="outline" className="gap-2 px-8" asChild>
              <a href="https://github.com/user/cambrian" target="_blank" rel="noopener noreferrer">
                <IconBrandGithub className="h-5 w-5" />
                View on GitHub
              </a>
            </Button>
          </div>

          {/* Tech badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {["TypeScript", "React", "Nostr", "Local-First", "AI-Native"].map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: IconSeedling,
      title: "Digital Garden",
      description: "Cultivate thoughts using Zettelkasten and evergreen note-taking principles. Notes grow and evolve over time.",
    },
    {
      icon: IconGraph,
      title: "Knowledge Graph",
      description: "Bi-directional wiki-links connect your thoughts into a living, explorable network of ideas.",
    },
    {
      icon: IconCloudOff,
      title: "Local-First",
      description: "Works offline, syncs when online. Your data lives on your device first, always available.",
    },
    {
      icon: IconCloud,
      title: "Decentralized",
      description: "Built on Nostr-inspired relay architecture. No central server, no single point of failure.",
    },
    {
      icon: IconKey,
      title: "Self-Sovereign",
      description: "Own your keys, own your data, own your social graph. Credible exit is built-in.",
    },
    {
      icon: IconBrain,
      title: "AI-Native",
      description: "Designed as a memory layer for AI companions. Structured for semantic retrieval.",
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tools for Thought</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Inspired by Zettelkasten, Noosphere, and the best of knowledge management
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section id="architecture" className="border-y border-border/50 bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Architecture</h2>
          <p className="mt-4 text-lg text-muted-foreground">Local-first with decentralized sync</p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-2xl border border-border bg-card p-8 font-mono text-sm overflow-x-auto">
            <pre className="text-muted-foreground">
              {`┌─────────────────────────────────────────────────────────────┐
│                      YOUR DEVICES                           │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Web App   │  │  Mobile PWA │  │     CLI     │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          ▼                                  │
│              ┌───────────────────────┐                      │
│              │    `}<span className="text-primary">@cambrian/sdk</span>{`     │                      │
│              │  (Isomorphic TS SDK)  │                      │
│              └───────────┬───────────┘                      │
│                          │                                  │
│         ┌────────────────┼────────────────┐                 │
│         ▼                ▼                ▼                 │
│   ┌───────────┐   ┌───────────┐   ┌───────────┐            │
│   │  Storage  │   │   Sync    │   │  Crypto   │            │
│   │  (Dexie)  │   │  Engine   │   │  (Keys)   │            │
│   └───────────┘   └─────┬─────┘   └───────────┘            │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │ WebSocket
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    `}<span className="text-chart-3">CAMBRIAN NETWORK</span>{`                         │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │   Node A    │  │   Node B    │  │   Node C    │        │
│   │ (Self-host) │  │ (Community) │  │  (Backup)   │        │
│   └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliverablesSection() {
  const deliverables = [
    {
      icon: IconLink,
      title: "Protocol Specs",
      description: "CIP specifications defining events, notes, links, sync, and encryption.",
      path: "/design",
      status: "In Progress",
    },
    {
      icon: IconCode,
      title: "TypeScript SDK",
      description: "Isomorphic library for clients and nodes. Works in browser, Node.js, and Bun.",
      path: "/sdk",
      status: "Planned",
    },
    {
      icon: IconApps,
      title: "Client App",
      description: "Daily-use digital garden app built with React, Vite, and shadcn/ui.",
      path: "/app",
      status: "Planned",
    },
    {
      icon: IconServer,
      title: "Network Node",
      description: "Self-hostable relay node powered by Bun and Postgres.",
      path: "/node",
      status: "Planned",
    },
    {
      icon: IconTerminal2,
      title: "CLI Tool",
      description: "Command-line interface for full protocol interaction.",
      path: "/cli",
      status: "Planned",
    },
  ];

  return (
    <section id="deliverables" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Deliverables</h2>
          <p className="mt-4 text-lg text-muted-foreground">Everything you need to build on Cambrian</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-4">
          {deliverables.map((item) => (
            <div
              key={item.title}
              className="group flex items-center gap-6 rounded-xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/50 hover:bg-card"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{item.title}</h3>
                  <Badge variant={item.status === "In Progress" ? "default" : "secondary"} className="text-xs">
                    {item.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
              <code className="hidden text-sm text-muted-foreground sm:block">{item.path}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="border-t border-border/50 bg-gradient-to-b from-muted/30 to-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Build?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Cambrian is open source and in active development. Join us!
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <a href="https://github.com/user/cambrian" target="_blank" rel="noopener noreferrer">
                <IconBrandGithub className="h-5 w-5" />
                Star on GitHub
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 px-8">
              <IconExternalLink className="h-5 w-5" />
              Read the Specs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <img
              src="/images/cambrian_Icon_Light.svg"
              alt="Cambrian"
              className="h-6 w-6"
            />
            <span className="font-semibold text-foreground">Cambrian</span>
            <span>— Decentralized Digital Garden Protocol</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>MIT + Apache-2.0</span>
            <span>•</span>
            <a href="https://github.com/user/cambrian" className="transition-colors hover:text-foreground">
              GitHub
            </a>
            <span>•</span>
            <a href="#" className="transition-colors hover:text-foreground">
              Docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}