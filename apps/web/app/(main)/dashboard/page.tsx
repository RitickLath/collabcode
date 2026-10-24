"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowUpRight, Search, Loader2 } from "lucide-react"
import { Input } from "@workspace/ui/components/atom/input"
import { AppHeader } from "@/components/Organism/Dashboard/AppHeader"
import { DashboardBanner } from "@/components/Organism/Dashboard/DashboardBanner"
import { DashboardMetrics } from "@/components/Organism/Dashboard/DashboardMetrics"
import { WorkspaceCard } from "@/components/Molecules/Workspace/WorkspaceCard"
import { WorkspaceEmptyState } from "@/components/Molecules/Workspace/WorkspaceEmptyState"
import { WorkspacePagination } from "@/components/Molecules/Workspace/WorkspacePagination"
import {
  WorkspaceFilterBar,
  RoleFilterOption,
} from "@/components/Molecules/Workspace/WorkspaceFilterBar"
import { CreateWorkspaceModal } from "@/components/Organism/Workspace/CreateWorkspaceModal"
import { PendingInvitesBanner } from "@/components/Molecules/Workspace/PendingInvitesBanner"
import {
  useGetWorkspacesQuery,
  useGetMyPendingInvitesQuery,
} from "@/queries/workspace.query"
import { useMeQuery } from "@/queries/auth.query"

const CATEGORIES = ["All", "Fullstack", "Frontend", "Backend", "Git"] as const

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalView, setModalView] = useState<"template" | "git">("template")
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<RoleFilterOption>("all")
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [page, setPage] = useState(1)
  const limit = 6

  const { data: workspacesResponse, isLoading } = useGetWorkspacesQuery({
    page,
    limit,
    role: roleFilter,
    search: search.trim() || undefined,
  })

  const { data: currentUser } = useMeQuery()
  const { data: pendingInvites } = useGetMyPendingInvitesQuery()

  const workspaces = workspacesResponse?.items || []
  const meta = workspacesResponse?.meta || {
    page: 1,
    limit: 6,
    total: workspaces.length,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
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

  const runningCount = workspaces.filter((w) => w.status === "READY").length
  const totalCollaborators = useMemo(() => {
    const emails = new Set<string>()
    workspaces.forEach((w) => {
      w.members?.forEach((m) => {
        if (m.user?.email) emails.add(m.user.email)
      })
    })
    return emails.size
  }, [workspaces])

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

  const userDisplayName =
    (currentUser as any)?.name || (currentUser as any)?.username || "Developer"

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader onOpenCreateModal={handleOpenModal} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-8 p-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <DashboardBanner
          displayName={userDisplayName}
          onOpenModal={handleOpenModal}
        />

        {/* Pending Invites Banner */}
        {pendingInvites && pendingInvites.length > 0 && (
          <PendingInvitesBanner invites={pendingInvites} />
        )}

        {/* Metrics Grid */}
        <DashboardMetrics
          totalWorkspaces={meta.total || workspaces.length}
          runningWorkspacesCount={runningCount}
          totalCollaborators={totalCollaborators}
        />

        {/* Workspaces Section */}
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Active Cloud Workspaces
              </h2>
              <p className="text-xs text-muted-foreground">
                Select a workspace to enter the collaborative web IDE
              </p>
            </div>

            <Link
              href="/projects"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <span>View all projects</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Filter Bar with Role Selector (All / Owned by me / Shared with me) */}
          <WorkspaceFilterBar
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            search={search}
            onSearchChange={handleSearchChange}
            roleFilter={roleFilter}
            onRoleFilterChange={handleRoleChange}
          />

          {/* Loading */}
          {isLoading && (
            <div className="flex h-44 flex-col items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">
                Loading your workspaces...
              </p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && displayedWorkspaces.length === 0 && (
            <WorkspaceEmptyState
              hasFilter={Boolean(
                search || activeCategory !== "All" || roleFilter !== "all"
              )}
              onCreateClick={() => handleOpenModal("template")}
            />
          )}

          {/* Grid */}
          {!isLoading && displayedWorkspaces.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {displayedWorkspaces.map((project) => (
                  <WorkspaceCard key={project.id} project={project} />
                ))}
              </div>

              {/* Pagination */}
              <WorkspacePagination meta={meta} onPageChange={setPage} />
            </>
          )}
        </div>
      </main>

      <CreateWorkspaceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialView={modalView}
      />
    </div>
  )
}
