import React, { useCallback, useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

interface UseTerminalProps {
  workspaceId: string
  onOutput?: (data: string) => void
  onPortDetected?: (port: number) => void
}

/**
 * Strips ANSI color/cursor escape codes and inspects the terminal stream
 * for dev server startup messages (e.g. "localhost:5173", "127.0.0.1:3000", "0.0.0.0:8080").
 */
const detectPortFromOutput = (chunk: string): number | null => {
  if (!chunk) return null

  // 1. Strip ANSI escape sequences (colors, cursor positioning)
  const clean = chunk.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "")

  // 2. Look for URLs or localhost port patterns emitted by Vite, Next.js, Express, etc.
  // Examples matched: "http://localhost:5173", "127.0.0.1:3000", "0.0.0.0:8080", "port 3000"
  const urlMatch = clean.match(
    /(?:localhost|127\.0\.0\.1|0\.0\.0\.0):(\d{4,5})/i
  )
  if (urlMatch && urlMatch[1]) {
    const port = parseInt(urlMatch[1], 10)
    // Filter out standard non-dev ports if any
    if (port >= 1000 && port <= 65535) {
      return port
    }
  }

  // 3. Secondary match: "running on port 3000" or "port: 3000"
  const portWordMatch = clean.match(/(?:port|listening on)\s*[:]?\s*(\d{4,5})/i)
  if (portWordMatch && portWordMatch[1]) {
    const port = parseInt(portWordMatch[1], 10)
    if (port >= 1000 && port <= 65535) {
      return port
    }
  }

  return null
}

const useTerminal = ({
  workspaceId,
  onOutput,
  onPortDetected,
}: UseTerminalProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const [detectedPort, setDetectedPort] = useState<number | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const onOutputRef = useRef(onOutput)
  const onPortDetectedRef = useRef(onPortDetected)

  useEffect(() => {
    onOutputRef.current = onOutput
  }, [onOutput])

  useEffect(() => {
    onPortDetectedRef.current = onPortDetected
  }, [onPortDetected])

  useEffect(() => {
    if (!workspaceId) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
    const socketBaseUrl = apiUrl.replace(/\/api\/?$/, "")

    const socket = io(socketBaseUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    })

    socketRef.current = socket

    socket.on("connect", () => {
      setIsConnected(true)
      socket.emit("terminal:init", { workspaceId })
    })

    socket.on("terminal:ready", () => {
      console.log("[Socket] Terminal is ready")
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    socket.on("terminal:output", (data: string) => {
      // 1. Inspect output for running dev server port
      const foundPort = detectPortFromOutput(data)
      if (foundPort) {
        setDetectedPort(foundPort)
        onPortDetectedRef.current?.(foundPort)
      }

      // 2. Forward to xterm renderer
      onOutputRef.current?.(data)
    })

    socket.on("terminal:error", (data) => {
      console.error("[Socket] Terminal error:", data)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [workspaceId])

  const sendInput = useCallback(
    (data: string) => {
      socketRef.current?.emit("terminal:input", { workspaceId, data })
    },
    [workspaceId]
  )

  return { isConnected, socket: socketRef.current, sendInput, detectedPort }
}

export default useTerminal
