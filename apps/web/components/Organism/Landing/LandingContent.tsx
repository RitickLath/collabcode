import React from "react"
import Link from "next/link"
import {
  Code2,
  Terminal,
  Sparkles,
  ArrowRight,
  Users2,
  Zap,
  Cpu,
  Bot,
  Play,
  Share2,
  Layers,
  GitBranch,
  ShieldCheck,
  Cloud,
  Server,
  Rocket,
} from "lucide-react"

export function LandingContent() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background radial glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[580px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-[600px] right-0 -z-10 h-[400px] w-[500px] rounded-full bg-blue-500/10 blur-[130px]"
        aria-hidden="true"
      />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Real-time Multiplayer & Agentic AI Coding</span>
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.12]">
            Real-time collaborative cloud IDE,{" "}
            <span className="bg-linear-to-r from-primary via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              supercharged with AI.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Code simultaneously with your entire team with sub-50ms cursor sync,
            interactive cloud terminal containers, and an intelligent AI pair
            programmer that understands your whole codebase.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95 hover:shadow-primary/30"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Launch Cloud Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3.5 text-sm font-semibold backdrop-blur-md transition hover:bg-muted"
            >
              <Users2 className="h-4 w-4 text-primary" />
              <span>Invite Team & Pair</span>
            </Link>
          </div>

          {/* Metrics / Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-medium text-foreground">
                Multi-cursor live sync
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-primary" />
              <span>Autonomous AI refactoring</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-blue-400" />
              <span>Instant Linux container execution</span>
            </div>
          </div>
        </div>

        {/* Interactive Editor Mockup / Preview */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-border/70 bg-card/60 shadow-2xl backdrop-blur-xl">
          {/* Editor Header Bar */}
          <div className="flex h-11 items-center justify-between border-b border-border/60 bg-muted/40 px-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="ml-4 flex items-center gap-1.5 rounded-md bg-background/80 px-2.5 py-1 font-mono text-foreground shadow-xs">
                <Code2 className="h-3.5 w-3.5 text-primary" />
                <span>main.ts</span>
                <span className="ml-1 text-[10px] text-muted-foreground">
                  • saved
                </span>
              </div>
            </div>

            {/* Live presence indicator mock */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1.5 overflow-hidden">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white ring-2 ring-background">
                  JD
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white ring-2 ring-background">
                  AL
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white ring-2 ring-background">
                  AI
                </div>
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                3 active peers
              </span>
            </div>
          </div>

          {/* Editor Code & AI Split preview */}
          <div className="grid grid-cols-1 divide-y divide-border/60 font-mono text-xs md:grid-cols-12 md:divide-x md:divide-y-0">
            {/* Code area */}
            <div className="bg-background/50 p-6 md:col-span-8">
              <div className="space-y-1 leading-relaxed text-muted-foreground">
                <div>
                  <span className="text-purple-400">import</span> &#123;
                  createServer &#125;{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-emerald-400">
                    &quot;collab-sync&quot;
                  </span>
                  ;
                </div>
                <div>
                  <span className="text-purple-400">import</span> &#123;
                  aiAssistant &#125;{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-emerald-400">
                    &quot;@ai/pilot&quot;
                  </span>
                  ;
                </div>
                <div className="text-foreground/30">
                  // ⚡ Sub-50ms live room synchronized
                </div>
                <div>
                  <span className="text-blue-400">export const</span>{" "}
                  <span className="text-yellow-300">workspace</span> ={" "}
                  <span className="text-blue-400">new</span>{" "}
                  <span className="text-cyan-300">Workspace</span>(&#123;
                </div>
                <div className="pl-4">
                  roomId:{" "}
                  <span className="text-emerald-400">
                    &quot;prod-team-room-42&quot;
                  </span>
                  ,
                </div>
                <div className="pl-4">
                  multiplayer: <span className="text-purple-400">true</span>,
                </div>
                <div className="relative pl-4">
                  aiPairing: <span className="text-purple-400">true</span>,
                  {/* Cursor simulation */}
                  <span className="py-0.2 ml-1 inline-flex items-center rounded bg-blue-500 px-1.5 font-sans text-[10px] text-white">
                    Alex (typing...)
                  </span>
                </div>
                <div>&#125;);</div>
                <br />
                <div>
                  <span className="text-foreground/40">
                    // AI autonomously optimizing algorithm...
                  </span>
                </div>
                <div className="rounded border border-primary/20 bg-primary/10 p-2 text-primary">
                  <span className="font-bold">✨ AI Suggested:</span> Replaced
                  O(N²) search with inverted Trie index (92% latency reduction).
                </div>
              </div>
            </div>

            {/* AI Assistant Sidebar Panel */}
            <div className="flex flex-col justify-between bg-card/40 p-5 md:col-span-4">
              <div>
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-1.5 font-sans font-semibold text-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>AI Copilot</span>
                  </div>
                  <span className="font-sans text-[10px] text-muted-foreground">
                    Active
                  </span>
                </div>
                <div className="mt-4 space-y-3 font-sans text-xs">
                  <div className="rounded-lg bg-muted/60 p-3 text-muted-foreground">
                    <p className="font-medium text-foreground">
                      Explain current file
                    </p>
                    <p className="mt-1 text-[11px]">
                      Analyzing dependencies, real-time socket events, and AST
                      nodes.
                    </p>
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                      <Bot className="h-3.5 w-3.5" />
                      <span>Ready to generate tests</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Generated 4 unit tests covering race conditions & edge
                      cases.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-lg border border-border bg-background/80 p-2.5 font-sans text-xs text-muted-foreground">
                <span>Ask AI anything about this file...</span>
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Core Cloud IDE Pillars */}
        <div id="features" className="mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Engineered for seamless cloud development
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Everything you expect from VS Code, running instantly in your
              browser with zero environment configuration.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-border bg-card/40 p-6 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users2 className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                Real-Time Multiplayer
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Conflict-free replicated data types (CRDTs) ensure concurrent
                edits and multiple cursors never desync or cause collisions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-border bg-card/40 p-6 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                Full-Repo AI Awareness
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                AI with full repository context. Ask questions, debug syntax,
                auto-generate types, and perform architectural refactors in
                seconds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-border bg-card/40 p-6 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                Live Cloud Terminal
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Execute scripts, run package managers, start development
                servers, and debug processes inside isolated sandbox containers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-border bg-card/40 p-6 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                One-Click Shareable Links
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Instantly invite peers or interview candidates with a single
                secure link. Share read-only reviews or full editing control.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-border bg-card/40 p-6 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <GitBranch className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                Git & Revision History
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Full revision history, granular checkpoints, branch switching,
                and diff visualizers so you never lose progress.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-border bg-card/40 p-6 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                Secure Isolation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Ephemeral cloud containers run safely in isolated sandboxes with
                end-to-end encrypted WebSocket transports.
              </p>
            </div>
          </div>
        </div>

        {/* Dedicated Cloud Instance Deployment Section (Upcoming Roadmap) */}
        <div id="deployments" className="mt-28">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-8 shadow-xl backdrop-blur-xl sm:p-12">
            {/* Glow */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 -z-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]"
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-500 dark:text-cyan-400">
                  <Cloud className="h-3.5 w-3.5" />
                  <span>Future Roadmap • One-Click Provisioning</span>
                </div>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Deploy instantly with dedicated cloud instances
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Transform any workspace into production in seconds. Provision
                  your own dedicated cloud compute instance (CPU/GPU, RAM,
                  persistent SSD) directly from the IDE without leaving your
                  editor.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                  <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/50 p-3">
                    <Server className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Dedicated Compute Instances
                      </p>
                      <p className="mt-0.5 text-muted-foreground">
                        Custom instances tailored to your workload with full
                        root privileges.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/50 p-3">
                    <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Zero-Config CI/CD
                      </p>
                      <p className="mt-0.5 text-muted-foreground">
                        Automated TLS certificates, custom domains, and
                        zero-downtime rollouts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Terminal / Deployment Instance Card */}
              <div className="lg:col-span-5">
                <div className="rounded-xl border border-border/80 bg-background/90 p-4 font-mono text-xs shadow-lg">
                  <div className="flex items-center justify-between border-b border-border pb-2 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                      <span>instance-deployer.sh</span>
                    </div>
                    <span className="text-[10px] text-primary">v0.9-alpha</span>
                  </div>
                  <div className="mt-3 space-y-1.5 leading-relaxed text-muted-foreground">
                    <p className="text-foreground">
                      $ collab deploy --instance c5.large
                    </p>
                    <p className="text-emerald-400">
                      ✔ Allocating compute container (4 vCPU, 8GB)...
                    </p>
                    <p className="text-emerald-400">
                      ✔ Syncing workspace build artifacts...
                    </p>
                    <p className="text-emerald-400">
                      ✔ Attaching persistent NVMe volume...
                    </p>
                    <p className="text-cyan-400">
                      🚀 Instance Live: https://prod-app-42.collabcode.cloud
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="relative mt-24 overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-card/80 to-primary/5 p-8 text-center shadow-xl sm:p-12">
          <div className="relative z-10 mx-auto max-w-2xl">
            <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Ready to code together in the cloud?
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Create your workspace in seconds with your GitHub or CollabCode
              account.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
