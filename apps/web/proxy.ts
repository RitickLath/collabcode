import { jwtVerify } from "jose"
import { NextRequest, NextResponse } from "next/server"

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
}

// Convert secret key into a format the 'jose' library understands
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

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
    await jwtVerify(cookie, JWT_SECRET)

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}
