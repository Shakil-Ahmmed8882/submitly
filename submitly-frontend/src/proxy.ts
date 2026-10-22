import { type NextRequest, NextResponse } from "next/server";
import { routes } from "@/routes/app.routes";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|api/).*)"],
};

const GUEST_ROUTES: string[] = [routes.login, routes.register];

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

// The backend sets a readable `role` cookie next to the httpOnly token. This is
// only a routing hint; the API enforces access on every request.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("role")?.value;

  if (pathname === routes.home) {
    return redirectTo(request, role ? routes.dashboard : routes.login);
  }

  if (GUEST_ROUTES.includes(pathname)) {
    return role ? redirectTo(request, routes.dashboard) : NextResponse.next();
  }

  if (!role) {
    const loginUrl = new URL(routes.login, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith(routes.submit) && role !== "STUDENT") {
    return redirectTo(request, routes.dashboard);
  }

  return NextResponse.next();
}
