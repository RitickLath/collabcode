"use client"

import React from "react"
import Link from "next/link"
import { LandingContent } from "@/components/Organism/Landing/LandingContent"
import { NavbarAuth } from "@/components/Organism/Landing/NavbarAuth"
import { Code2 } from "lucide-react"

export default function RootLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold tracking-tight"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-primary-foreground shadow-md shadow-primary/20">
                <Code2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                CollabCode
              </span>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                AI Beta
              </span>
            </Link>
            <nav className="hidden items-center gap-6 text-xs font-medium text-muted-foreground md:flex">
              <Link
                href="/projects"
                className="transition hover:text-foreground"
              >
                Workspaces
              </Link>
              <Link
                href="/dashboard"
                className="transition hover:text-foreground"
              >
                Dashboard
              </Link>
            </nav>
          </div>
          <NavbarAuth />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <LandingContent />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/20 py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">CollabCode</span>
            <span>— Cloud IDE with Multiplayer Sync & AI Assistance</span>
          </div>
          <p>
            © {new Date().getFullYear()} CollabCode. Built for collaborative
            engineering teams.
          </p>
        </div>
      </footer>
    </div>
  )
}
