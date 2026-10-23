"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { AuthService } from "@/services/auth.service"
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  )
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    if (!token || !email) {
      setStatus("error")
      setMessage("Invalid verification link. Missing token or email parameter.")
      return
    }

    let isMounted = true

    const verify = async () => {
      try {
        const res: any = await AuthService.verifyEmail(token, email)
        if (isMounted) {
          setStatus("success")
          setMessage(
            res?.message ||
              "Your email has been successfully verified! You can now log in."
          )
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("error")
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Verification link is invalid or has expired."
          setMessage(Array.isArray(msg) ? msg[0] : msg)
        }
      }
    }

    verify()

    return () => {
      isMounted = false
    }
  }, [token, email])

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-8 text-center shadow-xl backdrop-blur-xl">
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Verifying your email...
            </h1>
            <p className="text-sm text-muted-foreground">
              Please wait while we validate your verification token.
            </p>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Email Verified!
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
          </div>
          <Button className="mt-4 w-full" onClick={() => router.push("/login")}>
            <span>Proceed to Sign In</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <XCircle className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Verification Failed
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
          </div>
          <div className="flex w-full flex-col gap-2 pt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/register")}
            >
              Back to Sign Up
            </Button>
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              Already verified? Sign in here
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
