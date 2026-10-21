import {
  ClipboardList,
  LayoutDashboard,
  type LucideIcon,
  PenSquare,
  Shield,
  UserRound,
} from "lucide-react";
import type { User } from "@/types/auth.type";
import { routes } from "./app.routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  visible: (user: User) => boolean;
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: routes.dashboard,
    icon: LayoutDashboard,
    visible: () => true,
  },
  {
    label: "Submit project",
    href: routes.create,
    icon: PenSquare,
    visible: () => true,
  },
  {
    label: "My submissions",
    href: routes.submissions,
    icon: ClipboardList,
    visible: () => true,
  },
  {
    label: "Profile",
    href: routes.profile,
    icon: UserRound,
    visible: () => true,
  },
  {
    label: "Admin",
    href: routes.admin,
    icon: Shield,
    visible: (user) => user.role === "MENTOR",
  },
];

export function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
