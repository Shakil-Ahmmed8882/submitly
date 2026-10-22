export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  submit: "/dashboard/submit",
  profile: "/dashboard/profile",
} as const;

export function safeNext(value: string | null) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    [...value].some((character) => character.charCodeAt(0) <= 32)
  )
    return routes.dashboard;
  try {
    const parsed = new URL(value, "https://internal.invalid");
    if (
      parsed.origin !== "https://internal.invalid" ||
      [routes.login, routes.register].some((path) => parsed.pathname === path)
    )
      return routes.dashboard;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return routes.dashboard;
  }
}

export function loginUrl(next: string, expired = false) {
  const params = new URLSearchParams({ next: safeNext(next) });
  if (expired) params.set("reason", "session-expired");
  return `${routes.login}?${params}`;
}
