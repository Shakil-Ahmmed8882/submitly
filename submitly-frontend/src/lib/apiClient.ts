import { type FetchOptions, ofetch } from "ofetch";
import type { ApiEnvelope } from "@/types/api.type";
import { ApiError, toApiError } from "./api-error";
import { sessionEvents } from "./session-events";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const http = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  retry: 0,
  timeout: 30_000,
});

// A 401 from these is a wrong credential, not an expired session.
const CREDENTIAL_PATHS = new Set(["/auth/login", "/auth/register"]);

async function apiClient<T>(path: string, options: FetchOptions<"json"> = {}) {
  if (!BASE_URL) {
    throw new ApiError(0, "NEXT_PUBLIC_API_BASE_URL is not configured.");
  }
  try {
    const result = await http<ApiEnvelope<T>>(path, options);
    if (!result.success) {
      throw new ApiError(result.statusCode, result.message, result);
    }
    return result;
  } catch (error) {
    const failure = toApiError(error);
    if (failure.status === 401 && !CREDENTIAL_PATHS.has(path)) {
      sessionEvents.expired();
      throw new ApiError(401, failure.message, undefined, true);
    }
    throw failure;
  }
}

export default apiClient;
