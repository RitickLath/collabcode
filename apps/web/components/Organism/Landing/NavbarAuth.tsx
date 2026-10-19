"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMeQuery, useLogoutMutation } from "@/queries/auth.query"
import { LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/Molecules/ThemeToggle"

export function NavbarAuth() {
  const router = useRouter()
  const { data: user, isLoading } = useMeQuery()
  const logoutMutation = useLogoutMutation()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logoutMutation.mutateAsync()
    } catch {
      // ignore
    } finally {
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      router.push("/login")
      router.refresh()
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-8 w-20 animate-pulse rounded-md bg-muted/30" />
    )
  }

  if (user) {
    console.log("HHHH", user)
    const userData: any = user
    const displayName = userData.name || userData.username || "Developer"
    const userInitial = (displayName.charAt(0) || "U").toUpperCase()

    return (
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/40 px-2.5 py-1 text-xs">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-500 text-[11px] font-bold text-white shadow-xs">
            {userInitial}
          </div>
          <span className="hidden font-medium text-foreground sm:inline">
            {displayName}
          </span>
        </div>

        <ThemeToggle />

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Log out"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-card/40 text-muted-foreground transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-500"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <Link
        href="/login"
        className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        Log in
      </Link>
      <Link
        href="/register"
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        Sign up
      </Link>
    </div>
  )
}
