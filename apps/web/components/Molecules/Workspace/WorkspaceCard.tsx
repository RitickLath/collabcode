"use client"

import React from "react"
import Link from "next/link"
import { ExternalLink, GitBranch, Clock, Loader2 } from "lucide-react"
import { WorkspaceItem } from "@/types/workspace"

interface WorkspaceCardProps {
  project: WorkspaceItem
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ project }) => {
  const targetUrl = `/project/${project.id}`
  const isReady = project.status === "READY"

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-border/50 bg-card/30 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/60 hover:shadow-lg">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-sm font-bold text-primary shadow-xs">
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              {!isReady ? (
                <span className="line-clamp-1 cursor-not-allowed text-sm font-semibold text-foreground/80">
                  {project.name}
                </span>
              ) : (
                <Link
                  href={targetUrl}
                  className="line-clamp-1 text-sm font-semibold text-foreground transition hover:text-primary"
                >
                  {project.name}
                </Link>
              )}
              <p className="text-[11px] font-medium text-muted-foreground">
                {project.framework}
              </p>
            </div>
          </div>

          <span
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
              isReady
                ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border border-amber-500/20 bg-amber-500/10 text-amber-400"
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

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {project.description ||
            (project.gitUrl
              ? `Imported from ${project.gitUrl}`
              : `${project.framework} cloud workspace container`)}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1 font-mono">
            <GitBranch className="h-3 w-3 text-muted-foreground/70" />
            main
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground/70" />
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border/40 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary/70" />
            <span>{project.owner?.username || "You"}</span>
          </div>

          {isReady ? (
            <Link
              href={targetUrl}
              className="flex items-center gap-1 text-xs font-semibold text-primary transition hover:underline"
            >
              <span>Open IDE</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 text-xs text-amber-400/80">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Building container...</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
