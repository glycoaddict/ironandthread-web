// src/proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16.2+ Proxy Convention
 * This runs at the network boundary before any request is completed.
 */
export default function proxy(request: NextRequest) {
  // We return the clerkMiddleware execution
  return clerkMiddleware()(request);
}

export const config = {
  matcher: [
    // 1. Skip Next.js internals and all static files (images, fonts, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 2. Always run for API routes to ensure your Supabase calls are protected
    '/(api|trpc)(.*)',
  ],
};