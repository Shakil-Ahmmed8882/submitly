import {
  ClipboardList,
  LayoutDashboard,
  type LucideIcon,
  PenSquare,
  UserRound,
} from "lucide-react";
import type { User } from "@/types/auth.type";
import { routes } from "./app.routes";

export type TNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  visible: (user: User) => boolean;
};

export const navItems: TNavItem[] = [
  {
    label: "Review dashboard",
    href: routes.dashboard,
    icon: LayoutDashboard,
    visible: (user) => user.role === "MENTOR",
  },
  {
    label: "My submissions",
    href: routes.dashboard,
    icon: ClipboardList,
    visible: (user) => user.role === "STUDENT",
  },
  {
    label: "Submit project",
    href: routes.submit,
    icon: PenSquare,
    visible: (user) => user.role === "STUDENT",
  },
  {
    label: "Profile",
    href: routes.profile,
    icon: UserRound,
    visible: () => true,
  },
];

// `/dashboard` is the parent of every other page, so it only matches itself.
export function isActiveRoute(pathname: string, href: string) {
  if (href === routes.dashboard) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
