import Link from "next/link";
import { routes } from "@/routes";
import AuthCard from "./AuthCard";

export default function ResetPasswordForm() {
  return (
    <AuthCard title="Reset password" description="Password reset is not available.">
      <p className="text-sm text-muted-foreground">
        Please contact your mentor directly to reset your password.
      </p>
      <Link
        href={routes.login}
        className="mt-4 inline-block text-sm text-foreground underline-offset-2 hover:underline"
      >
        Back to login
      </Link>
    </AuthCard>
  );
}
