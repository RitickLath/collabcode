import { useWorkspaceSocketStore } from "@/store/useWorkspaceSocketStore"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { toast } from "sonner"

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
  const queryClient = useQueryClient()

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

    socketInstance.on("tree:updated", (data) => {
      console.log(
        `[Workspace] File tree updated by ${data.byUsername || data.byUser}:`,
        data
      )
      // 1. Invalidate the tree query cache so the UI automatically refreshes
      queryClient.invalidateQueries({
        queryKey: ["workspace-tree", workspaceId],
      })

      // Cleanly format path for human readability (strip workspaceId prefix if present)
      const cleanPath = (rawPath?: string) => {
        if (!rawPath) return ""
        if (rawPath.startsWith(`${workspaceId}/`)) {
          return rawPath.slice(workspaceId.length + 1)
        }
        return rawPath
      }

      // 2. Show a toast if another collaborator made the change
      if (data.byUser !== userId) {
        const author = data.byUsername
          ? `@${data.byUsername}`
          : "A collaborator"
        const friendlyPath = cleanPath(data.path)
        const friendlyOldPath = cleanPath(data.oldPath)

        if (data.action === "create") {
          toast.info(`${author} created a file ${friendlyPath}`)
        } else if (data.action === "delete") {
          toast.warning(`${author} deleted a file ${friendlyPath}`)
        } else if (data.action === "rename") {
          toast.info(`${author} renamed a file`, {
            description: `${friendlyOldPath} → ${friendlyPath}`,
          })
        }
      }
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
