import { FetchError } from "ofetch";

const DEFAULT_RETRY_AFTER_SECONDS = 15 * 60;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string>;
  readonly sessionExpired: boolean;
  readonly retryAfter: number;

  constructor(
    status: number,
    message: string,
    body?: unknown,
    sessionExpired = false,
    retryAfter = DEFAULT_RETRY_AFTER_SECONDS,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.sessionExpired = sessionExpired;
    this.retryAfter = retryAfter;
    this.fieldErrors = {};
    if (isRecord(body) && isRecord(body.errors)) {
      for (const [key, value] of Object.entries(body.errors)) {
        if (typeof value === "string") this.fieldErrors[key] = value;
      }
    }
  }

  get userMessage() {
    if (this.sessionExpired)
      return "Your session expired. Please sign in again.";
    if (this.status === 429)
      return this.message || "Too many attempts. Please try again later.";
    if (this.status === 0)
      return "Couldn't reach the server. Check your connection and try again.";
    if (this.status >= 500)
      return "Something went wrong on our side. Please try again.";
    return this.message || "Something went wrong. Please try again.";
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof FetchError) {
    const status = error.response?.status ?? 0;
    const body: unknown = error.data;
    const message =
      isRecord(body) && typeof body.message === "string" ? body.message : "";
    const retryAfter = Number(error.response?.headers.get("Retry-After"));
    return new ApiError(
      status,
      message,
      body,
      false,
      retryAfter > 0 ? retryAfter : undefined,
    );
  }
  return new ApiError(0, "The request could not be completed.");
}
