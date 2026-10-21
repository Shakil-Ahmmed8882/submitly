import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const role = request.cookies.get("role")?.value;
  const isAuthed = !!role;

  const isPublic = PUBLIC_ROUTES.some((r) =>
    r === "/" ? pathname === "/" : pathname.startsWith(r),
  );

  if (isPublic) {
    if (isAuthed) return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  if (!isAuthed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
