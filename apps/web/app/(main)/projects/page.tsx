"use client"

import React, { useState, useMemo } from "react"
import { Loader2 } from "lucide-react"
import { AppHeader } from "@/components/Organism/Dashboard/AppHeader"
import { WorkspacesHeader } from "@/components/Organism/Workspace/WorkspacesHeader"
import { WorkspaceFilterBar } from "@/components/Molecules/Workspace/WorkspaceFilterBar"
import { WorkspaceCard } from "@/components/Molecules/Workspace/WorkspaceCard"
import { WorkspaceEmptyState } from "@/components/Molecules/Workspace/WorkspaceEmptyState"
import { CreateWorkspaceModal } from "@/components/Organism/Workspace/CreateWorkspaceModal"
import { useGetWorkspacesQuery } from "@/queries/workspace.query"

const CATEGORIES = [
  "All",
  "Recent",
  "Fullstack",
  "Frontend",
  "Backend",
  "Git",
] as const

export default function WorkspacesListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalView, setModalView] = useState<"template" | "git">("template")
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [search, setSearch] = useState("")

  const { data: workspaces = [], isLoading } = useGetWorkspacesQuery()

  const handleOpenModal = (view: "template" | "git" = "template") => {
    setModalView(view)
    setModalOpen(true)
  }

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((w) => {
      // Category filter
      let matchesCat = true
      if (activeCategory === "Git") {
        matchesCat = Boolean(w.gitUrl) || w.framework === "git"
      } else if (activeCategory === "Frontend") {
        matchesCat = ["REACT", "VITE", "HTML"].includes(
          w.framework.toUpperCase()
        )
      } else if (activeCategory === "Fullstack") {
        matchesCat = ["NEXTJS"].includes(w.framework.toUpperCase())
      } else if (activeCategory === "Backend") {
        matchesCat = ["NODEJS", "PYTHON", "FASTAPI", "NESTJS"].includes(
          w.framework.toUpperCase()
        )
      }

      // Search query filter
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.framework.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q)

      return matchesCat && matchesSearch
    })
  }, [workspaces, activeCategory, search])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader onOpenCreateModal={handleOpenModal} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-8 p-4 py-8 sm:px-6 lg:px-8">
        {/* Top title and action bar */}
        <WorkspacesHeader onOpenModal={handleOpenModal} />

        {/* Filters and search bar */}
        <WorkspaceFilterBar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          search={search}
          onSearchChange={setSearch}
          placeholder="Search workspaces by name or stack..."
        />

        {/* Loading state */}
        {isLoading && (
          <div className="flex h-52 flex-col items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">
              Retrieving your cloud sandboxes...
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredWorkspaces.length === 0 && (
          <WorkspaceEmptyState
            hasFilter={Boolean(search || activeCategory !== "All")}
            onCreateClick={() => handleOpenModal("template")}
          />
        )}

        {/* Workspaces Grid */}
        {!isLoading && filteredWorkspaces.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorkspaces.map((project) => (
              <WorkspaceCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>

      <CreateWorkspaceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialView={modalView}
      />
    </div>
  )
}
