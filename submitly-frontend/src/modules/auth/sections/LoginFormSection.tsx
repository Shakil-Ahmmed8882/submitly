"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import {
  GenericForm,
  type GenericFormRef,
  SubmitButton,
  TextField,
} from "@/components/reusable-components/form";
import { ShowIf } from "@/components/reusable-components/guard/ShowIf";
import { type ApiError, toApiError } from "@/lib/api-error";
import { safeNext } from "@/routes/app.routes";
import type { LoginInput } from "@/types/auth.type";
import { loginSchema } from "@/validation/auth.validation";
import { useLogin } from "../services/auth.service.hooks";
import { AuthAlert, AuthError } from "../shared/AuthAlert";
import { applyServerFieldErrors, PasswordField } from "../shared/AuthFields";
import DemoAccountsSection from "./DemoAccountsSection";

export default function LoginFormSection() {
  const mutation = useLogin();
  const router = useRouter();
  const params = useSearchParams();
  const formRef = useRef<GenericFormRef<LoginInput>>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const sessionExpired = params.get("reason") === "session-expired";

  async function submit(values: LoginInput) {
    if (mutation.isPending) return;
    setError(null);
    try {
      await mutation.mutateAsync(values);
      router.replace(safeNext(params.get("next")));
    } catch (failure) {
      const result = toApiError(failure);
      setError(result);
      applyServerFieldErrors(formRef.current?.form, result.fieldErrors, [
        "email",
        "password",
      ]);
      if (result.status === 401) {
        formRef.current?.form.setValue("password", "");
        formRef.current?.form.setFocus("password");
      }
    }
  }

  return (
    <GenericForm
      ref={formRef}
      schema={loginSchema}
      initialValues={{ email: "", password: "" }}
      onSubmit={submit}
    >
      <ShowIf condition={sessionExpired}>
        <AuthAlert variant="info">
          Your session expired. Please sign in again.
        </AuthAlert>
      </ShowIf>
      <fieldset disabled={mutation.isPending} className="space-y-6">
        <TextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
        />
        <PasswordField />
      </fieldset>
      <DemoAccountsSection />
      <AuthError error={error} />
      <SubmitButton label="Log in" loadingLabel="Logging in..." />
    </GenericForm>
  );
}
