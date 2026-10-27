"use client"
import React, { useEffect, useRef } from "react"
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import "@xterm/xterm/css/xterm.css"
import useTerminal from "@/hooks/Terminal/useTerminal"

interface TerminalViewProps {
  workspaceId: string
}

const TerminalView: React.FC<TerminalViewProps> = ({ workspaceId }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const termRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  // 1. Hook up the socket connection and receive stream output
  const { isConnected, sendInput } = useTerminal({
    workspaceId,
    onOutput: (chunk: string) => {
      termRef.current?.write(chunk)
    },
  })

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
