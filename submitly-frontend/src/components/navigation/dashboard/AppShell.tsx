"use client";

import { Menu } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { ShowIf } from "@/components/reusable-components/guard/ShowIf";
import { Drawer } from "@/components/reusable-components/overlays/drawer/Drawer";
import { Button } from "@/components/ui/button";
import { toApiError } from "@/lib/api-error";
import { useSession } from "@/modules/auth/services/auth.service.hooks";
import { CenteredError } from "@/modules/shared/CenteredError";
import DashboardLoading from "@/modules/shared/DashboardLoading";
import { Sidebar } from "./Sidebar";
import { UserMenu } from "./UserMenu";

type TAppShellProps = {
  children: ReactNode;
};

const DESKTOP_QUERY = "(min-width: 960px)";

export function AppShell(props: TAppShellProps) {
  const { children } = props;
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const updateOnline = () => setOffline(!navigator.onLine);
    const closeOnDesktop = () => {
      if (window.matchMedia(DESKTOP_QUERY).matches) setOpen(false);
    };
    updateOnline();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, []);

  const user = session.data;
  // An expired session redirects to the login (SessionProvider); show the shell skeleton until then.
  if (session.isError && !toApiError(session.error).sessionExpired) {
    return (
      <CenteredError fullPage message={toApiError(session.error).userMessage}>
        <Button onClick={() => void session.refetch()}>Try again</Button>
      </CenteredError>
    );
  }
  if (!user) return <DashboardLoading />;

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-card min-[960px]:block">
        <Sidebar user={user} />
      </aside>
      <div className="min-w-0 min-[960px]:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="min-[960px]:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            aria-expanded={open}
          >
            <Menu />
          </Button>
          <div className="ml-auto">
            <UserMenu user={user} />
          </div>
        </header>
        <ShowIf condition={offline}>
          <output className="block border-b border-border bg-warning/10 px-4 py-3 text-sm text-warning">
            You're offline. Changes cannot be saved until you reconnect.
          </output>
        </ShowIf>
        <main
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1400px] space-y-8 px-4 py-8 outline-none sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        initialPageId="navigation"
        side="left"
        width={{ base: "min(320px, calc(100vw - 32px))" }}
        ariaLabel="Main navigation"
      >
        <Drawer.Page id="navigation">
          <div className="h-full pt-12">
            <Sidebar user={user} onNavigate={() => setOpen(false)} />
          </div>
        </Drawer.Page>
      </Drawer>
    </div>
  );
}
