"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/atom/dialog"
import { Input } from "@workspace/ui/components/atom/input"
import { Button } from "@workspace/ui/components/atom/button"
import { AlertTriangle, Loader2, Trash2 } from "lucide-react"

interface DeleteWorkspaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: {
    id: string
    name: string
  }
  onConfirmDelete: (workspaceId: string) => void
  isDeleting?: boolean
}

export const DeleteWorkspaceModal: React.FC<DeleteWorkspaceModalProps> = ({
  open,
  onOpenChange,
  workspace,
  onConfirmDelete,
  isDeleting = false,
}) => {
  const [confirmInput, setConfirmInput] = useState("")

  // Reset input value whenever modal is opened or closed
  useEffect(() => {
    if (!open) {
      setConfirmInput("")
    }
  }, [open])

  const isMatched = confirmInput.trim() === workspace.name.trim()

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isMatched || isDeleting) return
    onConfirmDelete(workspace.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/60 bg-card/95 p-0 shadow-2xl backdrop-blur-xl">
        {/* Clean Header with subtle danger icon */}
        <DialogHeader className="border-b border-border/40 p-5 pb-4 text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Delete Workspace
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Permanently remove project and all associated resources
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleDelete} className="space-y-4 p-5 pt-3">
          {/* Subtle Warning notice matching CollabCode card aesthetics */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
            This action cannot be undone. All files, members, invites, and cloud
            containers for{" "}
            <span className="font-semibold text-foreground">
              {workspace.name}
            </span>{" "}
            will be permanently erased.
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-delete-input"
              className="block text-xs font-medium text-foreground/80"
            >
              To confirm, type{" "}
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground select-all">
                {workspace.name}
              </span>{" "}
              below:
            </label>
            <Input
              id="confirm-delete-input"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={workspace.name}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              disabled={isDeleting}
              className="h-9 border-border/60 bg-background/50 font-mono text-xs focus-visible:ring-rose-500/50"
            />
          </div>

          <DialogFooter className="mt-5 flex items-center justify-end gap-2 border-t border-border/40 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
              className="h-8 border-border/50 px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Cancel
            </Button>
            <div
              className={!isMatched && !isDeleting ? "cursor-not-allowed" : ""}
              title={
                !isMatched
                  ? `Please enter the exact workspace name "${workspace.name}" to enable deletion`
                  : undefined
              }
            >
              <Button
                type="submit"
                size="sm"
                disabled={!isMatched || isDeleting}
                className="h-8 gap-1.5 bg-rose-600 px-3 text-xs font-medium text-white transition-all hover:bg-rose-700 disabled:pointer-events-none disabled:opacity-40"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3 w-3" />
                    <span>Delete this workspace</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
