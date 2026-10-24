import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveUrlAlias } from "@/lib/seo/url-alias-store";

/**
 * Next.js Edge Middleware for 301 Redirects & URL Aliases
 * Conforms to MASKANI.TJ SEO Specification v1.7 (Sections 1.1, 5, 13, 15)
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Ignore static assets, internal Next.js routes and API endpoints
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") || // files like favicon.ico, images, fonts
    pathname.startsWith("/manifest")
  ) {
    return NextResponse.next();
  }

  // 1. Check if the current URL has a registered 301 alias in url-alias-store
  const aliasMatch = resolveUrlAlias(pathname);
  if (aliasMatch && aliasMatch.targetPath !== pathname) {
    const redirectUrl = new URL(aliasMatch.targetPath + search, request.url);
    return NextResponse.redirect(redirectUrl, {
      status: aliasMatch.statusCode || 301,
      headers: {
        "X-Robots-Tag": "noindex, follow",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
