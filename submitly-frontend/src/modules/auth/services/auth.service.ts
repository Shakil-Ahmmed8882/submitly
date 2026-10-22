import apiClient from "@/lib/apiClient";
import type { LoginInput, RegisterInput, User } from "@/types/auth.type";

export async function register(input: RegisterInput) {
  const response = await apiClient<{ user: User }>("/auth/register", {
    method: "POST",
    body: input,
  });
  return response.data.user;
}

export async function login(input: LoginInput) {
  const response = await apiClient<{ user: User }>("/auth/login", {
    method: "POST",
    body: input,
  });
  return response.data.user;
}

export async function logout() {
  await apiClient<null>("/auth/logout", { method: "POST" });
}

export async function me(signal?: AbortSignal) {
  const response = await apiClient<{ user: User }>("/auth/me", { signal });
  return response.data.user;
}
