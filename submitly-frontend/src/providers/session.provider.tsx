"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { sessionEvents } from "@/lib/session-events";
import { clearSession } from "@/modules/auth/services/auth.service.hooks";
import { loginUrl } from "@/routes/app.routes";

const DEDUPE_MS = 2000;

// Turns "the API said 401" into one toast and one redirect to the login page.
export default function SessionProvider() {
  const client = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    let lastExpiredAt = 0;
    return sessionEvents.subscribe(() => {
      const now = Date.now();
      if (now - lastExpiredAt < DEDUPE_MS) return;
      lastExpiredAt = now;
      const returnTo = `${window.location.pathname}${window.location.search}`;
      // biome-ignore lint/suspicious/noDocumentCookie: drops the readable role cookie so the proxy stops treating the user as signed in
      document.cookie = "role=; Max-Age=0; path=/";
      clearSession(client);
      toast.error("Your session expired. Please sign in again.");
      router.replace(loginUrl(returnTo, true));
    });
  }, [client, router]);
  return null;
}
