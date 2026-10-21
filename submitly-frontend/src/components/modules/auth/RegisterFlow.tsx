"use client";

import { BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  GenericForm,
  type GenericFormRef,
  SubmitButton,
  TextField,
} from "@/components/reusable-ui-blocks/form";
import { useAuthCooldown, useRegister } from "@/hooks/auth.hook";
import { type ApiError, toApiError } from "@/lib/api-error";
import { routes } from "@/routes";
import type { RegisterInput } from "@/types/auth.type";
import { registerSchema } from "@/validation/auth.validation";
import { AuthError } from "./AuthAlert";
import AuthCard from "./AuthCard";
import { applyServerFieldErrors, PasswordField } from "./AuthFields";

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
  const router = useRouter();
  const cooldown = useAuthCooldown();
  const detailsRef = useRef<GenericFormRef<RegisterInput>>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "MENTOR">("STUDENT");

  async function submitDetails(values: RegisterInput) {
    if (register.isPending || cooldown) return;
    setError(null);
    try {
      await register.mutateAsync({ ...values, role: selectedRole });
      toast.success("Account created. Please log in.");
      router.replace(routes.login);
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
        ref={detailsRef}
        schema={registerSchema}
        initialValues={{ name: "", email: "", password: "" }}
        onSubmit={submitDetails}
      >
        <fieldset disabled={register.isPending} className="space-y-6">
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
          loadingLabel="Creating account..."
          disabled={cooldown > 0}
        />
      </GenericForm>
    </AuthCard>
  );
}
