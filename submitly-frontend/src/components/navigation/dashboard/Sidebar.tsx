"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { BaseAvatar } from "@/components/reusable-components/images/variations/avatar/BaseAvatar";
import { cn } from "@/lib/utils";
import { isActiveRoute, navItems } from "@/routes/nav.routes";
import type { User } from "@/types/auth.type";

type TSidebarProps = {
  user: User;
  onNavigate?: () => void;
};

export function Sidebar(props: TSidebarProps) {
  const { user, onNavigate } = props;
  const pathname = usePathname();
  const visibleItems = navItems.filter((item) => item.visible(user));
  return (
    <div className="flex h-full flex-col px-4 py-5">
      <div className="mb-8">
        <Logo />
      </div>
      <nav aria-label="Workspace" className="space-y-1">
        {visibleItems.map((item) => {
          const active = isActiveRoute(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
                active ? "bg-accent text-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex items-center gap-3 border-t border-border pt-5">
        <BaseAvatar src={null} name={user.name} size="sm" />
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {user.role.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
