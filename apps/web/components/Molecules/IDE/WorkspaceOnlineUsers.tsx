"use client"

import React from "react"
import { useWorkspaceSocketStore } from "@/store/useWorkspaceSocketStore"

interface WorkspaceOnlineUsersProps {
  workspaceId: string
  className?: string
  maxVisible?: number
}

// Curated vibrant avatar palette with matching borders & glow
const AVATAR_PALETTES = [
  {
    bg: "bg-sky-500/20 text-sky-400 border-background ring-1 ring-sky-500/50 shadow-sky-500/10",
    badge: "bg-sky-400",
  },
  {
    bg: "bg-emerald-500/20 text-emerald-400 border-background ring-1 ring-emerald-500/50 shadow-emerald-500/10",
    badge: "bg-emerald-400",
  },
  {
    bg: "bg-amber-500/20 text-amber-400 border-background ring-1 ring-amber-500/50 shadow-amber-500/10",
    badge: "bg-amber-400",
  },
  {
    bg: "bg-fuchsia-500/20 text-fuchsia-400 border-background ring-1 ring-fuchsia-500/50 shadow-fuchsia-500/10",
    badge: "bg-fuchsia-400",
  },
  {
    bg: "bg-indigo-500/20 text-indigo-400 border-background ring-1 ring-indigo-500/50 shadow-indigo-500/10",
    badge: "bg-indigo-400",
  },
  {
    bg: "bg-rose-500/20 text-rose-400 border-background ring-1 ring-rose-500/50 shadow-rose-500/10",
    badge: "bg-rose-400",
  },
]

export const WorkspaceOnlineUsers: React.FC<WorkspaceOnlineUsersProps> = ({
  workspaceId,
  className = "",
  maxVisible = 4,
}) => {
  const { joinedUsers } = useWorkspaceSocketStore()

  // Filter users currently joined in this specific workspace
  const workspaceUsers = joinedUsers.filter(
    (user) => user.workspaceId === workspaceId
  )

  if (workspaceUsers.length === 0) return null

  const visibleUsers = workspaceUsers.slice(0, maxVisible)
  const overflowCount = workspaceUsers.length - maxVisible

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Overlapping Avatar Stack */}
      <div className="flex items-center -space-x-2">
        {visibleUsers.map((user, idx) => {
          const initial = (user.username || "U").charAt(0).toUpperCase()
          const palette =
            AVATAR_PALETTES[idx % AVATAR_PALETTES.length] || AVATAR_PALETTES[0]!

          return (
            <div
              key={user.userId || idx}
              className="group/avatar relative cursor-pointer"
              style={{ zIndex: 10 - idx }}
            >
              {/* Avatar Bubble */}
              <div
                className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 bg-card text-[11px] font-bold tracking-tight shadow-xs transition-all duration-200 group-hover/avatar:z-30 group-hover/avatar:scale-115 group-hover/avatar:shadow-md ${palette.bg}`}
              >
                <span>{initial}</span>

                {/* Online indicator dot with ping animation */}
                <span className="absolute -right-0.5 -bottom-0.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full border border-card bg-emerald-500" />
                </span>
              </div>

              {/* Floating Tooltip positioned below the avatar */}
              <div className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover/avatar:pointer-events-auto group-hover/avatar:opacity-100">
                {/* Arrow pointing up towards avatar */}
                <div className="absolute bottom-full left-1/2 -mb-px -translate-x-1/2 border-4 border-transparent border-b-border/80" />
                <div className="flex items-center gap-1.5 rounded-md border border-border/80 bg-popover px-2.5 py-1 text-xs font-medium whitespace-nowrap text-popover-foreground shadow-2xl">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-foreground">
                    @{user.username}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    • Online
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {/* Overflow Pill */}
        {overflowCount > 0 && (
          <div
            title={`${overflowCount} more online`}
            className="relative z-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground shadow-xs ring-1 ring-border/50"
          >
            +{overflowCount}
          </div>
        )}
      </div>

      {/* Online Count Badge */}
      <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 shadow-2xs select-none">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        <span>
          {workspaceUsers.length}{" "}
          {workspaceUsers.length === 1 ? "online" : "online"}
        </span>
      </div>
    </div>
  )
}

export default WorkspaceOnlineUsers
