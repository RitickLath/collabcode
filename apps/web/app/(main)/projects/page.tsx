"use client"

import React, { useState, useMemo } from "react"
import { Loader2 } from "lucide-react"
import { AppHeader } from "@/components/Organism/Dashboard/AppHeader"
import { WorkspacesHeader } from "@/components/Organism/Workspace/WorkspacesHeader"
import {
  WorkspaceFilterBar,
  RoleFilterOption,
} from "@/components/Molecules/Workspace/WorkspaceFilterBar"
import { WorkspaceCard } from "@/components/Molecules/Workspace/WorkspaceCard"
import { WorkspaceEmptyState } from "@/components/Molecules/Workspace/WorkspaceEmptyState"
import { WorkspacePagination } from "@/components/Molecules/Workspace/WorkspacePagination"
import { CreateWorkspaceModal } from "@/components/Organism/Workspace/CreateWorkspaceModal"
import { useGetWorkspacesQuery } from "@/queries/workspace.query"

const CATEGORIES = ["All", "Fullstack", "Frontend", "Backend", "Git"] as const

export default function WorkspacesListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalView, setModalView] = useState<"template" | "git">("template")
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [roleFilter, setRoleFilter] = useState<RoleFilterOption>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const limit = 6

  const { data: workspacesResponse, isLoading } = useGetWorkspacesQuery({
    page,
    limit,
    role: roleFilter,
    search: search.trim() || undefined,
  })

  const workspaces = workspacesResponse?.items || []
  const meta = workspacesResponse?.meta || {
    page: 1,
    limit: 6,
    total: workspaces.length,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  }

  const handleOpenModal = (view: "template" | "git" = "template") => {
    setModalView(view)
    setModalOpen(true)
  }

  const handleRoleChange = (newRole: RoleFilterOption) => {
    setRoleFilter(newRole)
    setPage(1)
  }

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  // Filter client-side category if selected
  const displayedWorkspaces = useMemo(() => {
    if (activeCategory === "All") return workspaces

    return workspaces.filter((w) => {
      const fw = w.framework.toUpperCase()
      switch (activeCategory) {
        case "Git":
          return Boolean(w.gitUrl) || fw === "GIT"
        case "Frontend":
          return ["REACT", "VITE", "HTML"].includes(fw)
        case "Fullstack":
          return ["NEXTJS"].includes(fw)
        case "Backend":
          return ["NODEJS", "PYTHON", "FASTAPI", "NESTJS"].includes(fw)
        default:
          return true
      }
    })
  }, [workspaces, activeCategory])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader onOpenCreateModal={handleOpenModal} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-8 p-4 py-8 sm:px-6 lg:px-8">
        {/* Top title and action bar */}
        <WorkspacesHeader onOpenModal={handleOpenModal} />

        {/* Filters and search bar with Role Selector */}
        <WorkspaceFilterBar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          search={search}
          onSearchChange={handleSearchChange}
          roleFilter={roleFilter}
          onRoleFilterChange={handleRoleChange}
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
        {!isLoading && displayedWorkspaces.length === 0 && (
          <WorkspaceEmptyState
            hasFilter={Boolean(
              search || activeCategory !== "All" || roleFilter !== "all"
            )}
            onCreateClick={() => handleOpenModal("template")}
          />
        )}

        {/* Workspaces Grid */}
        {!isLoading && displayedWorkspaces.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedWorkspaces.map((project) => (
                <WorkspaceCard key={project.id} project={project} />
              ))}
            </div>

            {/* Pagination Controls */}
            <WorkspacePagination meta={meta} onPageChange={setPage} />
          </>
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
