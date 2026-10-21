"use client";

import { BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  GenericForm,
  type GenericFormRef,
  SubmitButton,
  TextField,
} from "@/components/reusable-ui-blocks/form";
import { Button } from "@/components/ui/button";
import {
  useAuthCooldown,
  useRegister,
  useVerifyEmail,
} from "@/hooks/auth.hook";
import { type ApiError, toApiError } from "@/lib/api-error";
import { routes } from "@/routes";
import type { RegisterInput, VerifyEmailInput } from "@/types/auth.type";
import {
  registerSchema,
  verifyEmailSchema,
} from "@/validation/auth.validation";
import { AuthError } from "./AuthAlert";
import AuthCard from "./AuthCard";
import { applyServerFieldErrors, OtpField, PasswordField } from "./AuthFields";

const ROLES = [
  {
    value: "STUDENT",
    label: "Student",
    description: "Submit projects for review",
    icon: GraduationCap,
  },
  {
    value: "MENTOR",
    label: "Mentor",
    description: "Review and give feedback",
    icon: BookOpen,
  },
];

export default function RegisterFlow() {
  const register = useRegister();
  const verify = useVerifyEmail();
  const router = useRouter();
  const cooldown = useAuthCooldown();
  const detailsRef = useRef<GenericFormRef<RegisterInput>>(null);
  const otpRef = useRef<GenericFormRef<VerifyEmailInput>>(null);
  const [pendingDetails, setPendingDetails] = useState<RegisterInput | null>(
    null,
  );
  const [error, setError] = useState<ApiError | null>(null);
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "MENTOR">("STUDENT");
  const [resendSeconds, setResendSeconds] = useState(0);
  const busy = register.isPending || verify.isPending;
  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = setTimeout(
      () => setResendSeconds((value) => value - 1),
      1000,
    );
    return () => clearTimeout(timer);
  }, [resendSeconds]);

  async function submitDetails(values: RegisterInput) {
    if (busy || cooldown) return;
    setError(null);
    try {
      const result = await register.mutateAsync(values);
      setPendingDetails({ ...values, email: result.email });
      detailsRef.current?.form.reset();
      setResendSeconds(30);
    } catch (failure) {
      const result = toApiError(failure);
      setError(result);
      applyServerFieldErrors(detailsRef.current?.form, result.fieldErrors, [
        "name",
        "email",
        "password",
      ]);
      if (result.status === 409)
        detailsRef.current?.form.setError(
          "email",
          { type: "server", message: result.userMessage },
          { shouldFocus: true },
        );
    }
  }

  async function submitCode(values: VerifyEmailInput) {
    if (busy || cooldown || !pendingDetails) return;
    setError(null);
    try {
      await verify.mutateAsync({ ...values, email: pendingDetails.email });
      setPendingDetails(null);
      toast.success("Email verified. Your account is ready.");
      router.replace(routes.dashboard);
    } catch (failure) {
      const result = toApiError(failure);
      setError(result);
      applyServerFieldErrors(otpRef.current?.form, result.fieldErrors, [
        "email",
        "otp",
      ]);
      if (result.message === "Invalid verification code") {
        otpRef.current?.form.setValue("otp", "");
        otpRef.current?.form.setError(
          "otp",
          { type: "server", message: result.userMessage },
          { shouldFocus: true },
        );
      }
    }
  }

  async function resend() {
    if (!pendingDetails || busy || cooldown || resendSeconds) return;
    setError(null);
    try {
      await register.mutateAsync(pendingDetails);
      otpRef.current?.form.setValue("otp", "");
      setResendSeconds(30);
      toast.success("A new code has been sent.");
    } catch (failure) {
      setError(toApiError(failure));
    }
  }

  if (pendingDetails) {
    return (
      <AuthCard
        title="Check your email"
        description={
          <>
            We sent a 6-digit code to{" "}
            <span className="break-all text-foreground">
              {pendingDetails.email}
            </span>
            . Enter it to finish signing up.
          </>
        }
        footer="Didn't get a code? Check your spam folder."
      >
        <GenericForm
          key="verify"
          ref={otpRef}
          schema={verifyEmailSchema}
          initialValues={{ email: pendingDetails.email, otp: "" }}
          onSubmit={submitCode}
        >
          <fieldset disabled={busy} className="space-y-6">
            <OtpField description="Your code expires in 5 minutes." />
          </fieldset>
          <AuthError error={error} cooldown={cooldown} />
          {error?.status === 409 && (
            <Link
              href={routes.login}
              className="block text-sm text-link hover:underline"
            >
              Log in instead
            </Link>
          )}
          <SubmitButton
            label="Verify email"
            loadingLabel="Verifying..."
            isLoading={verify.isPending}
            disabled={busy || cooldown > 0}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => void resend()}
              disabled={busy || cooldown > 0 || resendSeconds > 0}
            >
              {register.isPending
                ? "Sending..."
                : resendSeconds
                  ? `Resend in ${resendSeconds}s`
                  : "Resend code"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={() => {
                setPendingDetails(null);
                setError(null);
              }}
            >
              {error && /expired/i.test(error.message)
                ? "Start over"
                : "Use a different email"}
            </Button>
          </div>
        </GenericForm>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create your account"
      description="Join Submitly and start submitting your projects."
      footer={
        <>
          Already have an account?{" "}
          <Link href={routes.login} className="text-foreground hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 mb-2">
        {ROLES.map(({ value, label, description, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelectedRole(value as "STUDENT" | "MENTOR")}
            className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selectedRole === value
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : "border-border bg-card hover:border-muted-foreground/40"
            }`}
          >
            <Icon className={`size-6 ${selectedRole === value ? "text-primary" : "text-muted-foreground"}`} />
            <div>
              <p className="text-sm font-medium leading-none">{label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </div>
          </button>
        ))}
      </div>
      <GenericForm
        key="details"
        ref={detailsRef}
        schema={registerSchema}
        initialValues={{ name: "", email: "", password: "" }}
        onSubmit={submitDetails}
      >
        <fieldset disabled={busy} className="space-y-6">
          <TextField name="name" label="Full name" autoComplete="name" placeholder="Your full name" required />
          <TextField
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          <PasswordField newPassword description="At least 8 characters." />
        </fieldset>
        <AuthError error={error} cooldown={cooldown} />
        {error?.status === 409 && (
          <Link
            href={routes.login}
            className="block text-sm text-link hover:underline"
          >
            Log in instead
          </Link>
        )}
        <SubmitButton
          label="Create account"
          loadingLabel="Sending code..."
          disabled={cooldown > 0}
        />
      </GenericForm>
    </AuthCard>
  );
}
