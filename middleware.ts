import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { i18n } from '@/lib/i18n';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const i18nMiddleware = createI18nMiddleware(i18n);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /:lang to /:lang/docs (skip RSC requests)
  if (/^\/[a-z]{2}$/.test(pathname) && !pathname.includes('_rsc')) {
    return NextResponse.redirect(new URL(`${pathname}/docs`, request.url));
  }

  return i18nMiddleware(request);
}

export const config = {
  // Matcher ignoring API routes, Next.js internals, and static assets
  // Important: exclude metadata routes like `/robots.txt` and `/sitemap.xml`
  // so they won't be redirected to `/{lang}/...` which would 404 unless you implement localized metadata routes.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets/|robots\\.txt|sitemap\\.xml|llms?\\.txt|llm-full\\.txt|llms-full\\.txt).*)',
  ],
};
