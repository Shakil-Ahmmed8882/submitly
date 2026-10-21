"use client";

import type { ReactNode } from "react";

function SessionGuard({
  children,
}: {
  mode: "guest" | "protected";
  children: ReactNode;
}) {
  return children;
}

export function GuestOnly({ children }: { children: ReactNode }) {
  return <SessionGuard mode="guest">{children}</SessionGuard>;
}

export function AuthGuard({ children }: { children: ReactNode }) {
  return <SessionGuard mode="protected">{children}</SessionGuard>;
}
