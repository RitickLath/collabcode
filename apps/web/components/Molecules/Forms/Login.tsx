"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, ArrowRight, Lock, User } from "lucide-react"
import { Input } from "@workspace/ui/components/atom/input"
import { Label } from "@workspace/ui/components/atom/label"
import { Button } from "@workspace/ui/components/atom/button"
import { useLoginMutation } from "@/queries/auth.query"

export default function LoginForm() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginMutation = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(identifier.trim())
    console.log(password)
    if (!identifier.trim() || !password) return

    setError(null)

    try {
      await loginMutation.mutateAsync({
        identifier: identifier.trim().toLowerCase(),
        password,
      })
      router.push("/")
      router.refresh()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid username or password"
      setError(Array.isArray(msg) ? msg[0] : msg)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-8 shadow-xl backdrop-blur-xl">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your CollabCode account to continue
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="identifier">Username or Email</Label>
          <div className="relative">
            <User className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="identifier"
              type="text"
              placeholder="e.g. alex_dev or alex@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="pl-9"
              required
              autoFocus
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground transition hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-9 pl-9"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-3 text-muted-foreground transition hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="mt-2 w-full gap-2 font-semibold"
          disabled={loginMutation.isPending || !identifier || !password}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}
