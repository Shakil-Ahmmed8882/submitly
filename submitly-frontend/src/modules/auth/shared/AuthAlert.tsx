import { AlertCircle, Info } from "lucide-react";
import type { ReactNode } from "react";
import type { ApiError } from "@/lib/api-error";
import { cn } from "@/lib/utils";

type TAuthAlertProps = {
  children: ReactNode;
  variant?: "error" | "info";
};

type TAuthErrorProps = {
  error: ApiError | null;
};

export function AuthAlert(props: TAuthAlertProps) {
  const { children, variant = "error" } = props;
  const isError = variant === "error";
  const Icon = isError ? AlertCircle : Info;
  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-sm border p-3 text-sm leading-5 text-foreground",
        isError
          ? "border-destructive/30 bg-destructive/5"
          : "border-border bg-muted",
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "mt-0.5 size-4 shrink-0",
          isError ? "text-destructive-text" : "text-muted-foreground",
        )}
      />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function AuthError(props: TAuthErrorProps) {
  const { error } = props;
  if (!error) return null;
  return (
    <AuthAlert>
      <p>{error.userMessage}</p>
    </AuthAlert>
  );
}
