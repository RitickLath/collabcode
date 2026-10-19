"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Lock,
  Mail,
  User,
  Check,
  X,
  Sparkles,
} from "lucide-react"
import { Input } from "@workspace/ui/components/atom/input"
import { Label } from "@workspace/ui/components/atom/label"
import { Button } from "@workspace/ui/components/atom/button"
import { AuthService } from "@/services/auth.service"
import { useRegisterMutation } from "@/queries/auth.query"

export default function RegisterForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null)

  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const registerMutation = useRegisterMutation()

  // Debounced real-time username availability check
  useEffect(() => {
    const trimmed = username.trim().toLowerCase()
    if (!trimmed || trimmed.length < 3) {
      setIsUsernameAvailable(null)
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      setIsUsernameAvailable(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true)
      try {
        const res = await AuthService.checkUsername(trimmed)
        setIsUsernameAvailable(res.isAvailable)
      } catch {
        setIsUsernameAvailable(null)
      } finally {
        setIsCheckingUsername(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !email.trim() || !password) return
    if (isUsernameAvailable === false) {
      setError("Please choose an available username")
      return
    }

    setError(null)
    setSuccessMsg(null)

    try {
      const res: any = await registerMutation.mutateAsync({
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
      })

      setSuccessMsg(
        res?.message ||
          "Registration successful! Please check your email to verify."
      )

      if (res?.message?.includes("Auto-verified")) {
        setTimeout(() => router.push("/login"), 1500)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please check your inputs."
      setError(Array.isArray(msg) ? msg[0] : msg)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-8 shadow-xl backdrop-blur-xl">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join CollabCode to build, practice, and run code in the cloud
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mt-5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-400">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
            <div>
              <p className="font-semibold">{successMsg}</p>
              <p className="mt-1 text-muted-foreground">
                Redirecting or waiting for verification...
              </p>
            </div>
          </div>
        </div>
      )}

      {!successMsg && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Username with real-time availability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="username">Username</Label>
              {username.trim().length >= 3 && (
                <span className="text-[11px] font-medium">
                  {isCheckingUsername ? (
                    <span className="text-muted-foreground">Checking...</span>
                  ) : isUsernameAvailable === true ? (
                    <span className="flex items-center gap-1 text-emerald-500">
                      <Check className="h-3 w-3" /> Available
                    </span>
                  ) : isUsernameAvailable === false ? (
                    <span className="flex items-center gap-1 text-destructive">
                      <X className="h-3 w-3" /> Taken
                    </span>
                  ) : null}
                </span>
              )}
            </div>
            <div className="relative">
              <User className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="alex_dev"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pr-9 pl-9"
                required
                autoFocus
              />
              <div className="absolute top-2.5 right-3 flex items-center">
                {isCheckingUsername && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-9 pl-9"
                minLength={8}
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
            <p className="text-[11px] text-muted-foreground">
              Must be at least 8 characters long
            </p>
          </div>

          <Button
            type="submit"
            className="mt-2 w-full gap-2 font-semibold"
            disabled={
              registerMutation.isPending ||
              !username.trim() ||
              !email.trim() ||
              password.length < 8 ||
              isUsernameAvailable === false
            }
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      )}

      <div className="mt-6 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
