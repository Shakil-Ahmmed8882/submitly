"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import * as auth from "@/api/auth.api";
import { ApiError } from "@/lib/api-error";
import { rateLimit } from "@/lib/rate-limit";
import { clearSessionCache, sessionQueryKey } from "@/lib/session-cache";
import { loginUrl, routes } from "@/routes";
import type { User } from "@/types/auth.type";

export { sessionQueryKey };

const MOCK_USER: User = {
  id: "mock-user-1",
  name: "Shakil Ahmmed",
  email: "shakil@submitly.com",
  emailVerified: true,
  avatarUrl: null,
  avatarPublicId: null,
  role: "USER",
  isPremium: false,
  premiumSince: null,
  status: "ACTIVE",
  isDeleted: false,
  deletedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function useSession() {
  return {
    data: MOCK_USER,
    isPending: false,
    isError: false,
    isFetching: false,
    failureCount: 0,
    error: null,
    refetch: async () => {},
  } as const;
}

export function useRegister() {
  return useMutation({ mutationFn: auth.register });
}

export function useVerifyEmail() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: auth.verifyEmail,
    onSuccess: (user) => client.setQueryData(sessionQueryKey, user),
  });
}

export function useLogin() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: auth.login,
    onSuccess: (user) => client.setQueryData(sessionQueryKey, user),
  });
}

export function useLogout() {
  const client = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: auth.logout,
    onMutate: () => client.cancelQueries(),
    onSuccess: async () => {
      await client.cancelQueries();
      clearSessionCache(client);
      toast.success("Logged out");
      router.replace(routes.home);
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.userMessage : "Couldn't log out.",
      );
    },
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: auth.forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: auth.resetPassword });
}

export function useAuthRedirect(
  mode: "guest" | "protected",
  returnTo = routes.dashboard as string,
) {
  const session = useSession();
  const router = useRouter();
  const hadSession = useRef(false);
  useEffect(() => {
    if (session.isPending || session.isError) return;
    if (session.data) hadSession.current = true;
    if (mode === "guest" && session.data) router.replace(returnTo);
    if (mode === "protected" && session.data === null && !hadSession.current)
      router.replace(loginUrl(returnTo));
  }, [
    mode,
    returnTo,
    router,
    session.data,
    session.isError,
    session.isPending,
  ]);
  return session;
}

export function useAuthCooldown() {
  const until = useSyncExternalStore(
    rateLimit.subscribe,
    rateLimit.getSnapshot,
    rateLimit.getServerSnapshot,
  );
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!until) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    setNow(Date.now());
    return () => clearInterval(timer);
  }, [until]);
  return Math.max(0, Math.ceil((until - (now || Date.now())) / 1000));
}
