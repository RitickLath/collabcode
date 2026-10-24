import { useWorkspaceSocketStore } from "@/store/useWorkspaceSocketStore"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

interface WorkspaceSocketProps {
  workspaceId: string
  userId?: string
  username?: string
}

export const useWorkspaceSocket = ({
  workspaceId,
  userId,
  username,
}: WorkspaceSocketProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  const { setUsers, setUserJoin, setUserLeave } = useWorkspaceSocketStore()

  useEffect(() => {
    // Do not connect until we have both valid workspaceId and authenticated userId
    if (!workspaceId || !userId) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
    const socketBaseUrl = apiUrl.replace(/\/api\/?$/, "")

    const socketInstance = io(socketBaseUrl, {
      withCredentials: true,
      transports: ["polling", "websocket"],
      reconnectionAttempts: 5,
    })

    socketRef.current = socketInstance

    socketInstance.on("connect", () => {
      console.log(`[Socket] Connected as ${username} (${userId})`)
      setIsConnected(true)

      // Join workspace room
      socketInstance.emit("workspace:join", {
        workspaceId,
        userId,
        username: username || "user",
      })
    })

    socketInstance.on("disconnect", (reason) => {
      console.log(`[Socket] Disconnected:`, reason)
      setIsConnected(false)
    })

    socketInstance.on("connect_error", (err) => {
      console.warn(`[Socket] Connection error:`, err.message)
    })

    socketInstance.on("workspace:user_joined", (data) => {
      console.log(`[Socket] User joined:`, data)
      setUserJoin(data)
    })

    socketInstance.on("workspace:user_left", (data) => {
      console.log(`[Socket] User left:`, data)
      setUserLeave(data)
    })

    socketInstance.on("workspace:sync_users", (data) => {
      console.log(`[Socket] Synced users:`, data.users)
      setUsers(data.users)
    })

    return () => {
      if (socketInstance) {
        socketInstance.emit("workspace:leave", {
          workspaceId,
          userId,
          username: username || "user",
        })
        socketInstance.disconnect()
        if (socketRef.current === socketInstance) {
          socketRef.current = null
        }
      }
      setIsConnected(false)
    }
  }, [workspaceId, userId])

  return { socket: socketRef.current, isConnected }
}

export default useWorkspaceSocket
