import apiClient from "@/lib/apiClient";
import type { LoginInput, RegisterInput, User } from "@/types/auth.type";

export async function register(input: RegisterInput) {
  return (
    await apiClient<{ user: User }>("/auth/register", {
      method: "POST",
      body: input,
    })
  ).data.user;
}

export async function login(input: LoginInput) {
  return (
    await apiClient<{ user: User }>("/auth/login", {
      method: "POST",
      body: input,
    })
  ).data.user;
}

export async function logout() {
  await apiClient<null>("/auth/logout", { method: "POST" });
}

export async function me(signal?: AbortSignal) {
  return (
    await apiClient<{ user: User }>("/auth/me", {
      signal,
      suppressSessionExpiry: true,
    })
  ).data.user;
}
