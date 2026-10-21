import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};

const PUBLIC_ROUTES = ["/", "/login", "/register"];
const STUDENT_HOME = "/submit";
const MENTOR_HOME = "/dashboard";
const STUDENT_ROUTES = ["/submit", "/my-submissions"];
const MENTOR_ROUTES = ["/dashboard"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const role = request.cookies.get("role")?.value as "STUDENT" | "MENTOR" | undefined;
  const isAuthed = !!role;

  if (PUBLIC_ROUTES.some((r) => r === "/" ? pathname === "/" : pathname.startsWith(r))) {
    if (isAuthed) {
      return NextResponse.redirect(
        new URL(role === "MENTOR" ? MENTOR_HOME : STUDENT_HOME, request.url)
      );
    }
    return NextResponse.next();
  }

  if (!isAuthed) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (role === "STUDENT" && MENTOR_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL(STUDENT_HOME, request.url));
  }
  if (role === "MENTOR" && STUDENT_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL(MENTOR_HOME, request.url));
  }

  return NextResponse.next();
}
