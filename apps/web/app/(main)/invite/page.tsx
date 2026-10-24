"use client"

import React, { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Loader2, FolderCode, Check, X, AlertCircle } from "lucide-react"
import {
  useAcceptInviteMutation,
  useRejectInviteMutation,
  useGetMyPendingInvitesQuery,
} from "@/queries/workspace.query"

function InviteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const { data: myInvites, isLoading: isInvitesLoading } =
    useGetMyPendingInvitesQuery()
  const { acceptInvite } = useAcceptInviteMutation()
  const { rejectInvite } = useRejectInviteMutation()

  // Match current invite from list if token exists, or fall back to single pending invite
  const currentInvite = token
    ? myInvites?.find((inv) => inv.token === token)
    : myInvites?.length === 1
      ? myInvites[0]
      : null

  const activeToken = token || currentInvite?.token

  const handleAccept = async () => {
    if (!activeToken) return
    try {
      const res = await acceptInvite.mutateAsync(activeToken)
      const targetWorkspaceId = res?.workspaceId || currentInvite?.workspace?.id
      if (targetWorkspaceId) {
        router.push(`/project/${targetWorkspaceId}`)
      } else {
        router.push("/dashboard")
      }
    } catch {
      // Toast handled by mutation
    }
  }

  const handleReject = async () => {
    if (!activeToken) return
    try {
      await rejectInvite.mutateAsync(activeToken)
      router.push("/dashboard")
    } catch {
      // Toast handled by mutation
    }
  }

  if (isInvitesLoading) {
    return (
      <div className="flex h-dvh w-dvw items-center justify-center bg-background/80 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!activeToken) {
    return (
      <div className="flex h-dvh w-dvw items-center justify-center bg-black/70 p-4">
        <Card className="w-full max-w-[450px] border-border bg-card/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">No Invitation Found</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 text-center">
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t find an active workspace invitation. You might
              have already accepted it, or the link has expired.
            </p>
            <Button
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const workspaceName = currentInvite?.workspace?.name || "CollabCode Workspace"
  const inviterName = currentInvite?.workspace?.inviter?.username
    ? `@${currentInvite.workspace.inviter.username}`
    : "A team member"
  const role = currentInvite?.role || "Member"

  return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-[450px] border-border/60 bg-card/90 shadow-2xl backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <FolderCode className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Workspace Invitation</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6">
          <div className="space-y-2 text-center">
            <p className="text-base font-semibold text-foreground">
              {workspaceName}
            </p>
            <p className="text-xs text-muted-foreground">
              {inviterName} has invited you to collaborate as a{" "}
              <span className="font-semibold text-primary">{role}</span>.
            </p>
            {currentInvite?.workspace?.description && (
              <p className="rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground">
                &ldquo;{currentInvite.workspace.description}&rdquo;
              </p>
            )}
          </div>

          <div className="grid w-full grid-cols-2 gap-3">
            <Button
              variant="outline"
              disabled={acceptInvite.isPending || rejectInvite.isPending}
              onClick={handleReject}
            >
              {rejectInvite.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <X className="mr-1.5 h-4 w-4" />
                  Decline
                </>
              )}
            </Button>
            <Button
              disabled={acceptInvite.isPending || rejectInvite.isPending}
              onClick={handleAccept}
            >
              {acceptInvite.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="mr-1.5 h-4 w-4" />
                  Accept
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function InviteAcceptOrReject() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh w-dvw items-center justify-center bg-background/80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <InviteContent />
    </Suspense>
  )
}
