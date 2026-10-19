"use client"

import React from "react"
import { Folder, Activity, Cpu, Users } from "lucide-react"

interface DashboardMetricsProps {
  totalWorkspaces: number
  runningWorkspacesCount: number
  totalCollaborators: number
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  totalWorkspaces,
  runningWorkspacesCount,
  totalCollaborators,
}) => {
  const containerPercent =
    totalWorkspaces > 0 ? (runningWorkspacesCount / totalWorkspaces) * 100 : 0

  const allocatedCpu = runningWorkspacesCount * 2 || 2
  const cpuPercent = Math.min(100, (allocatedCpu / 16) * 100)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Workspaces */}
      <div className="group rounded-xl border border-border/50 bg-card/30 p-5 transition hover:border-primary/30 hover:bg-card/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Total Workspaces
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Folder className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {totalWorkspaces}
          </span>
          <span className="text-xs text-muted-foreground">sandboxes</span>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Connected cloud workspaces
        </p>
      </div>

      {/* Active Containers */}
      <div className="group rounded-xl border border-border/50 bg-card/30 p-5 transition hover:border-emerald-500/30 hover:bg-card/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Active Containers
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <Activity className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {runningWorkspacesCount} / {totalWorkspaces}
          </span>
          <span className="text-xs font-medium text-emerald-400">online</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${containerPercent}%` }}
          />
        </div>
      </div>

      {/* Allocated Compute */}
      <div className="group rounded-xl border border-border/50 bg-card/30 p-5 transition hover:border-blue-500/30 hover:bg-card/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Allocated Compute
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Cpu className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {allocatedCpu.toFixed(1)} vCPU
          </span>
          <span className="text-xs text-muted-foreground">/ 16 vCPU</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${cpuPercent}%` }}
          />
        </div>
      </div>

      {/* Collaborators */}
      <div className="group rounded-xl border border-border/50 bg-card/30 p-5 transition hover:border-purple-500/30 hover:bg-card/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Collaborators
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {totalCollaborators}
          </span>
          <span className="text-xs text-muted-foreground">active devs</span>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Multiplayer live sync
        </p>
      </div>
    </div>
  )
}
