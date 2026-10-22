"use client";

import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toApiError } from "@/lib/api-error";
import { routes } from "@/routes/app.routes";
import * as auth from "./auth.service";

export const sessionQueryKey = ["session"] as const;

export function clearSession(client: QueryClient) {
  client.removeQueries();
  client.setQueryData(sessionQueryKey, null);
}

export function useSession() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: ({ signal }) => auth.me(signal),
    staleTime: 60_000,
    retry: false,
  });
}

export function useRegister() {
  return useMutation({ mutationFn: auth.register });
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
    onSuccess: () => {
      clearSession(client);
      toast.success("Logged out");
      router.replace(routes.login);
    },
    onError: (error) => toast.error(toApiError(error).userMessage),
  });
}
