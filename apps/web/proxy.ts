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

  const cookie = request.cookies.get("accessToken")?.value

  if (!cookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL! + "/auth/me",
      {
        headers: {
          Authorization: `Bearer ${cookie}`,
          Cookie: `accessToken=${cookie}`,
        },
        timeout: 3000,
      }
    )

    if (response.status !== 200 || !response.data?.id) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Backend may still be booting or token is invalid/expired
    return NextResponse.redirect(new URL("/login", request.url))
  }
}
