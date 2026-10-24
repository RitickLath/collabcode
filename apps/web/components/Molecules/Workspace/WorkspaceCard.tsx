"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ExternalLink,
  GitBranch,
  Clock,
  Loader2,
  Crown,
  Users,
  Box,
  Component,
  TerminalSquare,
  Bot,
  Code2,
  Layers,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react"
import { WorkspaceItem } from "@/types/workspace"
import { useMeQuery } from "@/queries/auth.query"
import { useDeleteWorkspaceMutation } from "@/queries/workspace.query"
import { EditWorkspaceModal } from "@/components/Organism/Workspace/EditWorkspaceModal"
import { WorkspaceInviteModal } from "@/components/Organism/Workspace/WorkspaceInviteModal"
import { Button } from "@workspace/ui/components/atom/button"

interface WorkspaceCardProps {
  project: WorkspaceItem
}

// Visual badge themes per framework
const getFrameworkStyle = (framework: string) => {
  const fw = framework.toUpperCase()
  switch (fw) {
    case "NEXTJS":
      return {
        icon: Box,
        gradient: "from-sky-500/20 via-blue-500/10 to-transparent",
        accent: "text-sky-400 border-sky-500/30 bg-sky-500/10",
      }
    case "REACT":
    case "VITE":
      return {
        icon: Component,
        gradient: "from-cyan-500/20 via-teal-500/10 to-transparent",
        accent: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
      }
    case "NODEJS":
      return {
        icon: TerminalSquare,
        gradient: "from-emerald-500/20 via-green-500/10 to-transparent",
        accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      }
    case "PYTHON":
      return {
        icon: Bot,
        gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
        accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      }
    case "FASTAPI":
      return {
        icon: Code2,
        gradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
        accent: "text-teal-400 border-teal-500/30 bg-teal-500/10",
      }
    case "NESTJS":
      return {
        icon: Layers,
        gradient: "from-rose-500/20 via-red-500/10 to-transparent",
        accent: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      }
    default:
      return {
        icon: GitBranch,
        gradient: "from-primary/20 via-primary/5 to-transparent",
        accent: "text-primary border-primary/30 bg-primary/10",
      }
  }
}

// Colors for member avatars
const AVATAR_COLORS = [
  "bg-gradient-to-tr from-violet-600 to-indigo-500 text-white",
  "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white",
  "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white",
  "bg-gradient-to-tr from-amber-600 to-orange-500 text-white",
  "bg-gradient-to-tr from-rose-600 to-pink-500 text-white",
]

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ project }) => {
  const { data: currentUser } = useMeQuery()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteWorkspace } = useDeleteWorkspaceMutation()

  const targetUrl = `/project/${project.id}`
  const isReady = project.status === "READY"

  const fwStyle = getFrameworkStyle(project.framework)
  const FwIcon = fwStyle.icon

  // Check if current user is the owner
  const currentUserId = (currentUser as any)?.id
  const isOwner = Boolean(currentUserId && project.ownerId === currentUserId)

  const ownerName =
    project.owner?.username || project.owner?.email?.split("@")[0] || "Owner"

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete workspace "${project.name}"? This action cannot be undone.`
      )
    ) {
      setIsDeleting(true)
      deleteWorkspace.mutate(project.id, {
        onSettled: () => setIsDeleting(false),
      })
    }
  }

  // Members list
  const members = project.members || []
  const maxAvatars = 4
  const visibleMembers = members.slice(0, maxAvatars)
  const extraCount = members.length - maxAvatars

  return (
    <>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card/75 hover:shadow-xl hover:shadow-primary/5">
        {/* Top subtle radial accent */}
        <div
          className={`pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-gradient-to-br ${fwStyle.gradient} opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
        />

        <div>
          {/* Top Header: Framework icon + Name + Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${fwStyle.accent} shadow-xs transition-transform duration-300 group-hover:scale-105`}
              >
                <FwIcon className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                {!isReady ? (
                  <span className="line-clamp-1 cursor-not-allowed text-sm font-bold tracking-tight text-foreground/80">
                    {project.name}
                  </span>
                ) : (
                  <Link
                    href={targetUrl}
                    className="line-clamp-1 text-sm font-bold tracking-tight text-foreground transition hover:text-primary"
                  >
                    {project.name}
                  </Link>
                )}

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    {project.framework}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <GitBranch className="h-2.5 w-2.5" />
                    main
                  </span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-2xs ${
                isReady
                  ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                  : "border border-amber-500/25 bg-amber-500/10 text-amber-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isReady ? "bg-emerald-400" : "animate-pulse bg-amber-400"
                }`}
              />
              {isReady ? "Ready" : "Provisioning"}
            </span>
          </div>

          {/* Description */}
          <p className="mt-3.5 line-clamp-2 min-h-[2rem] text-xs leading-relaxed text-muted-foreground">
            {project.description ||
              (project.gitUrl
                ? `Cloned from ${project.gitUrl}`
                : `${project.framework} containerized development environment`)}
          </p>

          {/* Ownership Pill & Collaborators Row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/30 pt-3">
            {/* Owner info */}
            <div className="flex items-center gap-1.5 text-[11px]">
              {isOwner ? (
                <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 font-medium text-primary">
                  <Crown className="h-3 w-3" />
                  You (Owner)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <span className="text-muted-foreground/60">Owner:</span>
                  <span className="font-medium text-foreground/90">
                    @{ownerName}
                  </span>
                </span>
              )}
            </div>

            {/* Members / Collaborators Avatar Stack with Tooltip on Hover */}
            {members.length > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {visibleMembers.map((member, idx) => {
                    const uname =
                      member.user?.username ||
                      member.user?.email?.split("@")[0] ||
                      "dev"
                    const initial = uname.charAt(0).toUpperCase()
                    const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length]

                    return (
                      <div
                        key={member.id || idx}
                        className="group/avatar relative cursor-default"
                      >
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold shadow-xs transition-transform hover:z-10 hover:scale-110 ${colorClass}`}
                        >
                          {initial}
                        </div>

                        {/* Tooltip on Hover */}
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 -translate-x-1/2 rounded-md border border-border/60 bg-popover px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover/avatar:opacity-100">
                          @{uname}
                          <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 border-4 border-transparent border-t-popover" />
                        </div>
                      </div>
                    )
                  })}

                  {/* Extra count bubble if > 4 members */}
                  {extraCount > 0 && (
                    <div
                      title={`${extraCount} more member${extraCount > 1 ? "s" : ""}`}
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[9px] font-semibold text-muted-foreground shadow-xs"
                    >
                      +{extraCount}
                    </div>
                  )}
                </div>

                <span className="text-[10px] font-medium text-muted-foreground">
                  {members.length} {members.length === 1 ? "dev" : "devs"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer bar */}
        <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-3.5">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3 text-muted-foreground/60" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Edit / Delete / Invite actions for Owner */}
            {isOwner && (
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  onClick={() => setIsInviteOpen(true)}
                  title="Invite collaborators"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setIsEditOpen(true)}
                  title="Edit workspace"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  title="Delete workspace"
                >
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            )}

            {isReady ? (
              <Link
                href={targetUrl}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all duration-200 group-hover:shadow-sm hover:bg-primary hover:text-primary-foreground"
              >
                <span>Open IDE</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400/90">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Building pod...</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit Workspace Modal */}
      {isOwner && (
        <EditWorkspaceModal
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          workspace={{
            id: project.id,
            name: project.name,
            description: project.description,
          }}
        />
      )}

      {/* Invite Workspace Modal */}
      <WorkspaceInviteModal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        workspaceId={project.id}
        workspaceName={project.name}
        members={project.members}
        ownerId={project.ownerId}
        currentUserId={currentUserId}
      />
    </>
  )
}
