"use client"

import React, { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 2,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: false,
            gcTime: 10 * 60 * 1000,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
