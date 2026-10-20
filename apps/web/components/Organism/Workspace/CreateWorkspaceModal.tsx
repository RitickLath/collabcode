"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/atom/select"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/atom/tabs"
import { ScrollArea } from "@workspace/ui/components/atom/scroll-area"
import {
  FolderGit2,
  Search,
  Globe,
  GitPullRequest,
  Laptop,
  Loader2,
  Code2,
  Sparkles,
  Layers,
} from "lucide-react"
import { TemplateCard } from "@/components/Molecules/Workspace/TemplateCard"
import { WORKSPACE_TEMPLATES, StarterTemplate } from "@/constants/template"
import { useCreateWorkspaceMutation } from "@/queries/workspace.query"

interface CreateWorkspaceModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialView?: "template" | "git"
  initialFramework?: string
}

export const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  open = true,
  onOpenChange,
  initialView = "template",
  initialFramework = "NEXTJS",
}) => {
  const router = useRouter()
  const [view, setView] = useState<"template" | "git">(initialView)
  const [selectedFramework, setSelectedFramework] =
    useState<string>(initialFramework)
  const [activeTab, setActiveTab] = useState<string>("All")
  const [search, setSearch] = useState("")
  const [workspaceName, setWorkspaceName] = useState("")
  const [description, setDescription] = useState("")
  const [gitUrl, setGitUrl] = useState("")
  const [computeTier, setComputeTier] = useState("standard")

  useEffect(() => {
    if (open) {
      setView(initialView)
      if (initialFramework) {
        setSelectedFramework(initialFramework)
      }
    }
  }, [open, initialView, initialFramework])

  const { createWorkspace } = useCreateWorkspaceMutation()
  const isPending = createWorkspace.isPending

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false)
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!workspaceName.trim()) return

    try {
      if (view === "template") {
        await createWorkspace.mutateAsync({
          type: "TEMPLATE",
          framework: selectedFramework,
          name: workspaceName.trim(),
          description: description.trim() || undefined,
        })
      } else {
        if (!gitUrl.trim()) return
        await createWorkspace.mutateAsync({
          type: "GIT",
          gitUrl: gitUrl.trim(),
          name: workspaceName.trim(),
          description: description.trim() || undefined,
        })
      }

      handleClose()
      setWorkspaceName("")
      setDescription("")
      setGitUrl("")
      router.push("/projects")
    } catch (err) {
      console.error("Workspace creation failed:", err)
    }
  }

  const filteredTemplates = WORKSPACE_TEMPLATES.filter((t) => {
    const matchesTab = activeTab === "All" || t.category === activeTab
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    return matchesTab && matchesSearch
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full gap-0 overflow-hidden border-border/60 bg-background/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-[760px]">
        {/* Header and Core Settings */}
        <div className="border-b border-border/40 p-6 pb-5">
          <DialogHeader className="mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-xs">
                {view === "template" ? (
                  <Sparkles className="h-5 w-5" />
                ) : (
                  <GitPullRequest className="h-5 w-5" />
                )}
              </div>
              <div className="text-left">
                <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                  {view === "template"
                    ? "Create New Workspace"
                    : "Import Git Repository"}
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-xs text-muted-foreground">
                  {view === "template"
                    ? "Spin up an instant cloud workspace powered by preconfigured container environments."
                    : "Clone an existing public or accessible Git repository into a live cloud sandbox."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Workspace Name */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground/90">
                    Workspace Name <span className="text-primary">*</span>
                  </Label>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    collabcode/
                  </span>
                </div>
                <div className="relative flex items-center">
                  <FolderGit2 className="absolute left-3 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    placeholder="e.g. quantum-compiler"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="h-9 border-border/60 bg-muted/20 pl-9 text-xs focus-visible:ring-1 focus-visible:ring-primary/40"
                    autoFocus
                  />
                </div>
              </div>

              {/* Compute Preset */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground/90">
                    Compute Pod Tier
                  </Label>
                  <span className="text-[10px] font-medium text-emerald-400">
                    Free Tier
                  </span>
                </div>
                <Select
                  value={computeTier}
                  onValueChange={(val) => {
                    if (val) setComputeTier(val)
                  }}
                >
                  <SelectTrigger className="h-9 w-full border-border/60 bg-muted/20 text-xs focus:ring-1 focus:ring-primary/40">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard" className="text-xs">
                      <div className="flex items-center gap-2">
                        <Laptop className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Standard (2 vCPU, 4GB RAM) - Free</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="pro" className="text-xs" disabled>
                      <div className="flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Pro (8 vCPU, 16GB RAM) - Upgrade</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Git URL for Git view */}
            {view === "git" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground/90">
                  Git Repository URL <span className="text-primary">*</span>
                </Label>
                <div className="relative flex items-center">
                  <Globe className="absolute left-3 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    placeholder="https://github.com/organization/repo.git"
                    value={gitUrl}
                    onChange={(e) => setGitUrl(e.target.value)}
                    className="h-9 border-border/60 bg-muted/20 pl-9 text-xs focus-visible:ring-1 focus-visible:ring-primary/40"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Template Selection Section (only in template view) */}
        {view === "template" && (
          <div className="bg-muted/10 p-6 pt-4">
            <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                <Label className="text-xs font-semibold text-foreground/90">
                  Starter Template Environments
                </Label>
              </div>

              {/* Category tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="h-7"
              >
                <TabsList className="h-7 border border-border/40 bg-muted/30 p-0.5">
                  {(
                    ["All", "Frontend", "Fullstack", "Backend & AI"] as const
                  ).map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="h-full px-2.5 text-[10px] font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Template Search Bar */}
            <div className="relative mb-3.5">
              <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates (e.g. Next.js, Python, Express, Vite)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8.5 border-border/50 bg-background/50 pl-8.5 text-xs focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>

            {/* Template Grid */}
            <ScrollArea className="h-[250px] pr-2">
              <div className="grid grid-cols-1 gap-3 pb-2 sm:grid-cols-2">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedFramework === template.id}
                    onClick={() => setSelectedFramework(template.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="items-center border-t border-border/40 bg-background/60 px-6 py-3.5 sm:justify-between">
          <div>
            {view === "template" ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setView("git")}
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <GitPullRequest className="h-3.5 w-3.5 text-primary" />
                <span>Clone from Git repo instead</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setView("template")}
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Choose starter template</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={
                isPending ||
                !workspaceName.trim() ||
                (view === "git" && !gitUrl.trim())
              }
              onClick={() => handleSubmit()}
              className="h-8 gap-1.5 bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-95"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>
                {view === "template"
                  ? "Launch Workspace"
                  : "Import & Provision"}
              </span>
              {!isPending && (
                <kbd className="hidden rounded border border-primary-foreground/20 bg-primary-foreground/10 px-1 font-mono text-[9px] sm:inline-block">
                  ↵ Enter
                </kbd>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
