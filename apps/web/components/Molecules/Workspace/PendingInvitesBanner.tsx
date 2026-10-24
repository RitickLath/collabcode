"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Mail, Check, X, Loader2, Sparkles, FolderCode } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/atom/badge"
import {
  useAcceptInviteMutation,
  useRejectInviteMutation,
} from "@/queries/workspace.query"

interface PendingInvitesBannerProps {
  invites: Array<{
    id: string
    token: string
    role: string
    createdAt: string
    workspace: {
      id: string
      name: string
      description?: string | null
      framework: string
      inviter: {
        id: string
        username: string
        email: string
      }
    }
  }>
}

export function PendingInvitesBanner({ invites }: PendingInvitesBannerProps) {
  const router = useRouter()
  const { acceptInvite } = useAcceptInviteMutation()
  const { rejectInvite } = useRejectInviteMutation()

  if (!invites || invites.length === 0) return null

  const handleAccept = async (token: string, workspaceId: string) => {
    try {
      const res = await acceptInvite.mutateAsync(token)
      const targetWorkspaceId = res?.workspaceId || workspaceId
      if (targetWorkspaceId) {
        router.push(`/project/${targetWorkspaceId}`)
      }
    } catch {
      // toast already handled in mutation
    }
  }

  const handleReject = async (token: string) => {
    try {
      await rejectInvite.mutateAsync(token)
    } catch {
      // toast already handled in mutation
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
        <Mail className="h-4 w-4" />
        <span>Pending Workspace Invitations ({invites.length})</span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {invites.map((invite) => {
          const isAccepting =
            acceptInvite.isPending && acceptInvite.variables === invite.token
          const isRejecting =
            rejectInvite.isPending && rejectInvite.variables === invite.token

          return (
            <div
              key={invite.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card/80 to-card/50 p-4.5 shadow-lg shadow-primary/5 backdrop-blur-md transition-all hover:border-primary/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <FolderCode className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">
                        {invite.workspace.name}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="border border-primary/20 bg-primary/10 text-[10px] text-primary uppercase"
                      >
                        {invite.role}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Invited by{" "}
                      <span className="font-medium text-foreground">
                        @{invite.workspace.inviter.username}
                      </span>{" "}
                      ({invite.workspace.inviter.email})
                    </p>

                    {invite.workspace.description && (
                      <p className="line-clamp-1 text-xs text-muted-foreground/80">
                        {invite.workspace.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/40 pt-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  disabled={isAccepting || isRejecting}
                  onClick={() => handleReject(invite.token)}
                >
                  {isRejecting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <X className="mr-1 h-3.5 w-3.5" />
                      Decline
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  className="h-8 bg-primary text-xs text-primary-foreground shadow-sm hover:bg-primary/90"
                  disabled={isAccepting || isRejecting}
                  onClick={() =>
                    handleAccept(invite.token, invite.workspace.id)
                  }
                >
                  {isAccepting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Check className="mr-1 h-3.5 w-3.5" />
                      Accept & Join
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
