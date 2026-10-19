import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
}

export async function proxy(request: NextRequest) {
  // Extract pathname
  const pathname = request.nextUrl.pathname

  // Check if pathname starts with any of the excluded paths
  const isExcluded = ["_next/static", "_next/image", "favicon.ico"].some(
    (excludedPath) => pathname.startsWith(`/${excludedPath}`)
  )

  // If the request is for an excluded path, let Next.js handle it normally
  if (isExcluded) {
    return NextResponse.next()
  }

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")

  if (isPublic) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get("token")?.value

  if (!cookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_URL! + "/auth/me",
    {
      withCredentials: true,
    }
  )

  if (!response.data.ok) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
