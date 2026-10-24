"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/atom/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/atom/input"
import { Label } from "@workspace/ui/components/atom/label"
import { Badge } from "@workspace/ui/components/atom/badge"
import {
  Mail,
  UserPlus,
  Users,
  Clock,
  Trash2,
  Loader2,
  Shield,
  ShieldCheck,
  Send,
} from "lucide-react"
import {
  useGetWorkspaceInvitesQuery,
  useSendWorkspaceInviteMutation,
  useRevokeInviteMutation,
  useRemoveMemberMutation,
} from "@/queries/workspace.query"

interface WorkspaceInviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  workspaceName: string
  members?: Array<{
    id?: string
    role?: string
    user: {
      id: string
      username: string
      email: string
    }
  }>
  ownerId?: string
  currentUserId?: string
}

export function WorkspaceInviteModal({
  open,
  onOpenChange,
  workspaceId,
  workspaceName,
  members = [],
  ownerId,
  currentUserId,
}: WorkspaceInviteModalProps) {
  const [activeTab, setActiveTab] = useState<"invite" | "members">("invite")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("EDITOR")

  const { data: pendingInvites, isLoading: isInvitesLoading } =
    useGetWorkspaceInvitesQuery(open ? workspaceId : undefined)

  const { sendInvite } = useSendWorkspaceInviteMutation(workspaceId)
  const { revokeInvite } = useRevokeInviteMutation(workspaceId)
  const { removeMember } = useRemoveMemberMutation(workspaceId)

  const isOwner = Boolean(currentUserId && ownerId === currentUserId)

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      await sendInvite.mutateAsync({
        email: email.trim().toLowerCase(),
        role,
      })
      setEmail("")
    } catch {
      // Toast handled by mutation
    }
  }

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      await revokeInvite.mutateAsync(inviteId)
    } catch {
      // Toast handled by mutation
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember.mutateAsync(memberId)
    } catch {
      // Toast handled by mutation
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/60 bg-card/95 p-0 shadow-2xl backdrop-blur-xl">
        <DialogHeader className="border-b border-border/40 p-5 pb-4">
          <div className="flex items-center gap-2 text-primary">
            <UserPlus className="h-5 w-5" />
            <DialogTitle className="text-base font-bold text-foreground">
              Manage Team & Invites
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Collaborate on{" "}
            <span className="font-semibold text-foreground">
              {workspaceName}
            </span>
          </DialogDescription>

          {/* Navigation Pill Tabs */}
          <div className="mt-3 flex rounded-lg border border-border/40 bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("invite")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition ${
                activeTab === "invite"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send Invite</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("members")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition ${
                activeTab === "members"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>
                Team & Pending ({members.length + (pendingInvites?.length || 0)}
                )
              </span>
            </button>
          </div>
        </DialogHeader>

        <div className="p-5">
          {activeTab === "invite" ? (
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="invite-email" className="text-xs">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="teammate@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Role Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("EDITOR")}
                    className={`flex flex-col items-start rounded-lg border p-3 text-left transition ${
                      role === "EDITOR"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-card/50 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      <span>Editor</span>
                    </div>
                    <span className="mt-1 text-[11px] leading-tight text-muted-foreground">
                      Full read, write, run, and terminal access
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("VIEWER")}
                    className={`flex flex-col items-start rounded-lg border p-3 text-left transition ${
                      role === "VIEWER"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-card/50 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Viewer</span>
                    </div>
                    <span className="mt-1 text-[11px] leading-tight text-muted-foreground">
                      Read-only code viewing and previewing
                    </span>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-xs"
                disabled={sendInvite.isPending || !email.trim()}
              >
                {sendInvite.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    <span>Sending Invite...</span>
                  </>
                ) : (
                  <>
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    <span>Send Workspace Invite</span>
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="max-h-[360px] space-y-4 overflow-y-auto pr-1">
              {/* Existing Members */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Active Members ({members.length})
                </span>

                <div className="divide-y divide-border/30 rounded-lg border border-border/40 bg-card/40">
                  {members.map((member, i) => {
                    const isSelf = member.user?.id === currentUserId
                    const isWorkspaceOwner = member.user?.id === ownerId

                    return (
                      <div
                        key={member.id || i}
                        className="flex items-center justify-between p-2.5"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-foreground">
                              @{member.user?.username || "dev"}
                            </span>
                            {isWorkspaceOwner ? (
                              <Badge
                                variant="secondary"
                                className="border-amber-500/20 bg-amber-500/10 text-[9px] text-amber-400 uppercase"
                              >
                                Owner
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[9px] uppercase"
                              >
                                {member.role || "EDITOR"}
                              </Badge>
                            )}
                          </div>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {member.user?.email}
                          </p>
                        </div>

                        {/* Owner can kick other members */}
                        {isOwner &&
                          !isWorkspaceOwner &&
                          !isSelf &&
                          member.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleRemoveMember(member.id!)}
                              title="Remove member"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Pending Invites */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Pending Invitations ({pendingInvites?.length || 0})
                </span>

                {isInvitesLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                ) : !pendingInvites || pendingInvites.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border/40 p-3 text-center text-xs text-muted-foreground">
                    No pending invitations for this workspace
                  </p>
                ) : (
                  <div className="divide-y divide-border/30 rounded-lg border border-border/40 bg-card/40">
                    {pendingInvites.map((inv: any) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between p-2.5"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-xs font-medium text-foreground">
                              {inv.email}
                            </span>
                            <Badge
                              variant="secondary"
                              className="border-primary/20 bg-primary/10 text-[9px] text-primary uppercase"
                            >
                              {inv.role}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-2.5 w-2.5" />
                            <span>
                              Sent{" "}
                              {new Date(inv.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {isOwner && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleRevokeInvite(inv.id)}
                            title="Revoke invitation"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
