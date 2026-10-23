import { Suspense } from "react"
import LoginForm from "@/components/Molecules/Forms/Login"

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
