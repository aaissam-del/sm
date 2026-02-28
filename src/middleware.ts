// Middleware - protection des routes sans Prisma (Edge-compatible)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Route protection is handled at the page level (Server Components)
  // This middleware intentionally imports nothing from Prisma or NextAuth
  return NextResponse.next();
}

export const config = {
  matcher: [], // Empty - all protection handled at page level
};




