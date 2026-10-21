"use client"

import React, { useState } from "react"
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
import { Label } from "@workspace/ui/components/atom/label"
import { Loader2 } from "lucide-react"
import { useUpdateWorkspaceMutation } from "@/queries/workspace.query"

interface EditWorkspaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: {
    id: string
    name: string
    description?: string | null
  }
}

export const EditWorkspaceModal: React.FC<EditWorkspaceModalProps> = ({
  open,
  onOpenChange,
  workspace,
}) => {
  const [name, setName] = useState(workspace.name)
  const [description, setDescription] = useState(workspace.description || "")
  const { updateWorkspace } = useUpdateWorkspaceMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    updateWorkspace.mutate(
      {
        id: workspace.id,
        payload: {
          name: name.trim(),
          description: description.trim(),
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
          <DialogDescription>
            Update the name and description of your workspace project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-workspace-name">Workspace Name</Label>
            <Input
              id="edit-workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. awesome-saas-platform"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-workspace-desc">Description (Optional)</Label>
            <Input
              id="edit-workspace-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of this workspace..."
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateWorkspace.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || updateWorkspace.isPending}
            >
              {updateWorkspace.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
