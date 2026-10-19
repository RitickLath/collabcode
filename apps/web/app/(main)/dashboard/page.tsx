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
import { CreateWorkspaceModal } from "@/components/Organism/Workspace/CreateWorkspaceModal"
import { useGetWorkspacesQuery } from "@/queries/workspace.query"
import { useMeQuery } from "@/queries/auth.query"

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalView, setModalView] = useState<"template" | "git">("template")
  const [search, setSearch] = useState("")

  const { data: workspaces = [], isLoading } = useGetWorkspacesQuery()
  const { data: currentUser } = useMeQuery()

  const runningWorkspaces = useMemo(
    () => workspaces.filter((w) => w.status === "READY"),
    [workspaces]
  )

  const totalCollaborators = useMemo(() => {
    const emails = new Set<string>()
    workspaces.forEach((w) => {
      w.members?.forEach((m) => {
        if (m.user?.email) emails.add(m.user.email)
      })
    })
    return emails.size
  }, [workspaces])

  const filteredWorkspaces = useMemo(() => {
    if (!search.trim()) return workspaces
    const q = search.toLowerCase()
    return workspaces.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.framework.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q)
    )
  }, [workspaces, search])

  const handleOpenModal = (view: "template" | "git" = "template") => {
    setModalView(view)
    setModalOpen(true)
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

        {/* Metrics Grid */}
        <DashboardMetrics
          totalWorkspaces={workspaces.length}
          runningWorkspacesCount={runningWorkspaces.length}
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

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter workspaces..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8.5 w-48 border-border/50 bg-card/40 pr-3 pl-8 text-xs sm:w-60"
                />
              </div>

              <Link
                href="/projects"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <span>View all</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">
                Loading your workspaces...
              </p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && workspaces.length === 0 && (
            <WorkspaceEmptyState
              title="No active workspaces yet"
              description="Get started by launching a template or importing a Git repository into an isolated cloud container."
              onCreateClick={() => handleOpenModal("template")}
            />
          )}

          {/* Grid */}
          {!isLoading && filteredWorkspaces.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWorkspaces.slice(0, 6).map((project) => (
                <WorkspaceCard key={project.id} project={project} />
              ))}
            </div>
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
