"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Code2, LayoutDashboard, FolderGit2, Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"
import { NavbarAuth } from "@/components/Organism/Landing/NavbarAuth"

interface AppHeaderProps {
  onOpenCreateModal?: (view?: "template" | "git") => void
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenCreateModal }) => {
  const pathname = usePathname()

  const navLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      name: "Workspaces",
      href: "/projects",
      icon: FolderGit2,
      active: pathname === "/projects" || pathname.startsWith("/project/"),
    },
  ]

  return (
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
            <span className="text-lg font-bold tracking-tight">CollabCode</span>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              Cloud IDE
            </span>
          </Link>

          <nav className="hidden items-center gap-1.5 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    link.active
                      ? "bg-card text-foreground shadow-xs ring-1 ring-border/50"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {onOpenCreateModal && (
            <Button
              size="sm"
              onClick={() => onOpenCreateModal("template")}
              className="h-8.5 gap-1.5 bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Workspace</span>
              <span className="sm:hidden">New</span>
            </Button>
          )}

          <NavbarAuth />
        </div>
      </div>
    </header>
  )
}
