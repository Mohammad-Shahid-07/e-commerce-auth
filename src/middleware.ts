import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/auth";
export async function middleware(request: NextRequest) {
  const session = await getSession();

  // Check if the request URL is `/login` or `/signup`
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup"
  ) {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // For all other routes, if the user is not authenticated, redirect to `/login`
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If no conditions are met, proceed with the request
  return NextResponse.next();
}

// Specify the paths where this middleware should be applied
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Apply middleware to all routes except API and static files
  ],
};
