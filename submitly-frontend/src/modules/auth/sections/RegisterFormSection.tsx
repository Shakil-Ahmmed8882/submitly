"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  GenericForm,
  type GenericFormRef,
  SubmitButton,
  TextField,
} from "@/components/reusable-components/form";
import { ShowIf } from "@/components/reusable-components/guard/ShowIf";
import { type ApiError, toApiError } from "@/lib/api-error";
import { routes } from "@/routes/app.routes";
import type { RegisterInput } from "@/types/auth.type";
import { registerSchema } from "@/validation/auth.validation";
import { useRegister } from "../services/auth.service.hooks";
import { AuthError } from "../shared/AuthAlert";
import { applyServerFieldErrors, PasswordField } from "../shared/AuthFields";

export default function RegisterFormSection() {
  const mutation = useRegister();
  const router = useRouter();
  const formRef = useRef<GenericFormRef<RegisterInput>>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const emailTaken = error?.status === 409;

  async function submit(values: RegisterInput) {
    if (mutation.isPending) return;
    setError(null);
    try {
      await mutation.mutateAsync(values);
      toast.success("Account created. Please log in.");
      router.replace(routes.login);
    } catch (failure) {
      const result = toApiError(failure);
      setError(result);
      applyServerFieldErrors(formRef.current?.form, result.fieldErrors, [
        "name",
        "email",
        "password",
      ]);
      if (result.status === 409) {
        formRef.current?.form.setError(
          "email",
          { type: "server", message: result.userMessage },
          { shouldFocus: true },
        );
      }
    }
  }

  return (
    <GenericForm
      ref={formRef}
      schema={registerSchema}
      initialValues={{ name: "", email: "", password: "" }}
      onSubmit={submit}
    >
      <fieldset disabled={mutation.isPending} className="space-y-6">
        <TextField
          name="name"
          label="Full name"
          autoComplete="name"
          placeholder="Your full name"
          required
        />
        <TextField
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <PasswordField newPassword description="At least 6 characters." />
      </fieldset>
      <AuthError error={emailTaken ? null : error} />
      <ShowIf condition={emailTaken}>
        <Link
          href={routes.login}
          className="block text-sm text-link hover:underline"
        >
          Log in instead
        </Link>
      </ShowIf>
      <SubmitButton label="Create account" loadingLabel="Creating account..." />
    </GenericForm>
  );
}
