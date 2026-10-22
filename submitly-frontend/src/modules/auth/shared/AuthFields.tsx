"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { FieldValues, Path, useFormContext } from "react-hook-form";
import { TextField } from "@/components/reusable-components/form";

type TPasswordFieldProps = {
  name?: string;
  label?: string;
  newPassword?: boolean;
  description?: string;
};

export function PasswordField(props: TPasswordFieldProps) {
  const {
    name = "password",
    label = "Password",
    newPassword = false,
    description,
  } = props;
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      name={name}
      label={label}
      type={visible ? "text" : "password"}
      autoComplete={newPassword ? "new-password" : "current-password"}
      required
      description={description}
      action={() => setVisible((value) => !value)}
      actionLabel={visible ? "Hide password" : "Show password"}
      actionPressed={visible}
      icon={visible ? <EyeOff /> : <Eye />}
    />
  );
}

export function applyServerFieldErrors<T extends FieldValues>(
  form: ReturnType<typeof useFormContext<T>> | undefined,
  errors: Record<string, string>,
  fields: readonly Path<T>[],
) {
  if (!form) return;
  for (const field of fields) {
    if (errors[field]) {
      form.setError(field, { type: "server", message: errors[field] });
    }
  }
}
