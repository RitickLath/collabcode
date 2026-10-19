"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-lg border border-border/50 bg-card/40" />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={
        isDark
          ? "Switch to light mode (or press 'd')"
          : "Switch to dark mode (or press 'd')"
      }
      aria-label="Toggle theme"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-card/40 text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-all dark:text-slate-300" />
      )}
    </button>
  )
}
