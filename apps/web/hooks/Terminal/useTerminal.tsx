import React, { useCallback, useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

interface UseTerminalProps {
  workspaceId: string
  onOutput?: (data: string) => void
}

const useTerminal = ({ workspaceId, onOutput }: UseTerminalProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const onOutputRef = useRef(onOutput)

  useEffect(() => {
    onOutputRef.current = onOutput
  }, [onOutput])

  useEffect(() => {
    if (!workspaceId) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
    const socketBaseUrl = apiUrl.replace(/\/api\/?$/, "")

    const socket = io(socketBaseUrl, {
      withCredentials: true,
      transports: ["polling", "websocket"],
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

  return { isConnected, socket: socketRef.current, sendInput }
}

export default useTerminal
