import apiClient from "@/lib/apiClient";
import type {
  ChangePasswordRequest,
  UpdateProfileInput,
  UserProfile,
} from "@/types/user.type";

export async function getMe(signal?: AbortSignal) {
  const res = await apiClient<{ user: UserProfile }>("/auth/me", { signal });
  return res.data.user;
}

export async function updateMe(_input: UpdateProfileInput): Promise<UserProfile> {
  throw new Error("Profile update not supported.");
}

export async function uploadAvatar(_file: File): Promise<UserProfile> {
  throw new Error("Avatar upload not supported.");
}

export async function removeAvatar(): Promise<UserProfile> {
  throw new Error("Avatar removal not supported.");
}

export async function changePassword(_input: ChangePasswordRequest): Promise<void> {
  throw new Error("Password change not supported.");
}

export async function deleteMe(): Promise<void> {
  throw new Error("Account deletion not supported.");
}
