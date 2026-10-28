"use client"
import React, { useEffect, useRef, useState } from "react"
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import "@xterm/xterm/css/xterm.css"
import useTerminal from "@/hooks/Terminal/useTerminal"

import { useWorkspacePorts } from "@/queries/docker.query"
import { ExternalLink, Globe } from "lucide-react"

interface TerminalViewProps {
  workspaceId: string
  onOpenPreview?: (url: string) => void
}

const TerminalView: React.FC<TerminalViewProps> = ({
  workspaceId,
  onOpenPreview,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const termRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const [activePort, setActivePort] = useState<number | null>(null)

  // Fetch mapped host ports from docker
  const { data: forwardedPorts } = useWorkspacePorts(workspaceId)

  // 1. Hook up the socket connection and receive stream output
  const { isConnected, sendInput } = useTerminal({
    workspaceId,
    onOutput: (chunk: string) => {
      termRef.current?.write(chunk)
    },
    onPortDetected: (port: number) => {
      setActivePort(port)
    },
  })

  // Match detected container port (e.g. 5173) to mapped host URL (e.g. http://localhost:55002)
  const activePreviewUrl = React.useMemo(() => {
    if (!activePort || !forwardedPorts) return null
    const matched = forwardedPorts.find(
      (p: { containerPort: number; hostPort: number; url: string }) =>
        p.containerPort === activePort
    )
    return matched ? matched.url : `http://localhost:${activePort}`
  }, [activePort, forwardedPorts])

  // 2. Initialize xterm.js instance and mount to DOM
  useEffect(() => {
    if (!containerRef.current) return

    // Prevent duplicate terminal initialization
    if (termRef.current) return

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: "bar",
      fontSize: 12,
      fontFamily:
        "var(--font-mono, 'Menlo', 'Monaco', 'Courier New', monospace)",
      theme: {
        background: "#0c0d0e",
        foreground: "#d4d4d4",
        cursor: "#38bdf8",
        selectionBackground: "rgba(56, 189, 248, 0.3)",
        black: "#1e1e1e",
        red: "#f87171",
        green: "#4ade80",
        yellow: "#facc15",
        blue: "#60a5fa",
        magenta: "#c084fc",
        cyan: "#38bdf8",
        white: "#f3f4f6",
        brightBlack: "#4b5563",
        brightRed: "#ef4444",
        brightGreen: "#22c55e",
        brightYellow: "#eab308",
        brightBlue: "#3b82f6",
        brightMagenta: "#a855f7",
        brightCyan: "#06b6d4",
        brightWhite: "#ffffff",
      },
      convertEol: true,
      allowTransparency: true,
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)

    // Mount and render the terminal of xterm.js inside the container div
    term.open(containerRef.current)
    fitAddon.fit()

    termRef.current = term
    fitAddonRef.current = fitAddon

    // Send user keystrokes into the container
    const disposable = term.onData((data) => {
      sendInput(data)
    })

    // Resize observer to re-fit xterm when the drawer/panel size changes
    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit()
      } catch (err) {
        // Ignored when unmounted
      }
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      disposable.dispose()
      resizeObserver.disconnect()
      term.dispose()
      termRef.current = null
      fitAddonRef.current = null
    }
  }, [sendInput])

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0c0d0e] p-2">
      {/* 1. Live Dev Server Detected Banner */}
      {activePreviewUrl && (
        <div className="absolute top-2 right-4 z-20 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/80 px-2.5 py-1 text-xs text-emerald-300 shadow-lg backdrop-blur-md">
          <Globe className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
          <span>Dev server on port {activePort}</span>
          <a
            href={activePreviewUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-200 transition-colors hover:bg-emerald-500/30"
          >
            Open Live
            <ExternalLink className="h-3 w-3" />
          </a>
          {onOpenPreview && (
            <button
              onClick={() => onOpenPreview(activePreviewUrl)}
              className="rounded bg-primary/20 px-2 py-0.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/30"
            >
              Split View
            </button>
          )}
        </div>
      )}

      {!isConnected && (
        <div className="absolute top-2 right-4 z-10 flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          Connecting terminal...
        </div>
      )}
      <div ref={containerRef} className="h-full w-full overflow-hidden" />
    </div>
  )
}

export default TerminalView
