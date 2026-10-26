"use client"

import React from "react"
import { Terminal, RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"
import Link from "next/link"

interface SandboxStatusOverlayProps {
  status: "loading" | "error"
  workspaceName?: string
  errorMessage?: string
  onRetry?: () => void
}

export function SandboxStatusOverlay({
  status,
  workspaceName,
  errorMessage,
  onRetry,
}: SandboxStatusOverlayProps) {
  if (status === "loading") {
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background/95 backdrop-blur-md">
        {/* Subtle background glow effect */}
        <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 flex max-w-md flex-col items-center px-4 text-center">
          {/* Animated Spinner with Terminal Icon */}
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
            {/* Outer pulsating ring */}
            <div className="absolute inset-0 animate-pulse rounded-2xl bg-primary/20 blur-sm" />
            {/* Spinning gradient border */}
            <div className="h-16 w-16 animate-spin rounded-2xl border-2 border-primary/20 border-t-primary" />
            {/* Center icon */}
            <Terminal className="absolute h-7 w-7 animate-pulse text-primary" />
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Booting Workspace Sandbox
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {workspaceName ? (
              <>
                Mounting{" "}
                <span className="font-medium text-foreground">
                  {workspaceName}
                </span>{" "}
                inside isolated Docker container...
              </>
            ) : (
              "Mounting workspace directory into Docker container..."
            )}
          </p>

          {/* Progress indicators / badges */}
          <div className="mt-6 flex w-full max-w-xs flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <span>Docker Environment</span>
              <span className="flex items-center gap-1 font-mono text-emerald-400">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <span>Volume Bind Mount</span>
              <span className="animate-pulse font-mono text-primary">
                /workspace:rw
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Interactive TTY</span>
              <span className="font-mono text-muted-foreground">
                Attaching...
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background/95 backdrop-blur-md">
      <div className="relative z-10 flex max-w-md flex-col items-center px-4 text-center">
        {/* Error icon */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive shadow-sm">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Failed to Start Sandbox
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {errorMessage ||
            "Could not initialize the Docker execution environment. Ensure Docker Desktop is running locally on your machine."}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <Link href="/projects">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Projects
            </Button>
          </Link>
          {onRetry && (
            <Button onClick={onRetry} size="sm" className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Retry Connection
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
