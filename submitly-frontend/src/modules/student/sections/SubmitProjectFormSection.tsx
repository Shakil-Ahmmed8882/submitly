"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  GenericForm,
  type GenericFormRef,
  SubmitButton,
  TextareaField,
  TextField,
} from "@/components/reusable-components/form";
import { toApiError } from "@/lib/api-error";
import type { CreateSubmissionInput } from "@/types/submissions.type";
import {
  submissionSchema,
  type TSubmissionValues,
} from "@/validation/submission.validation";
import { useCreateSubmission } from "../services/student.service.hooks";

const INITIAL_VALUES: TSubmissionValues = {
  project_name: "",
  repo_url: "",
  live_link: "",
  description: "",
};

export default function SubmitProjectFormSection() {
  const mutation = useCreateSubmission();
  const formRef = useRef<GenericFormRef<TSubmissionValues>>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function submit(values: TSubmissionValues) {
    if (mutation.isPending || cooldown > 0) return;
    const input: CreateSubmissionInput = {
      project_name: values.project_name,
      repo_url: values.repo_url,
      description: values.description,
      ...(values.live_link ? { live_link: values.live_link } : {}),
    };
    try {
      await mutation.mutateAsync(input);
      formRef.current?.reset(INITIAL_VALUES);
    } catch (failure) {
      const error = toApiError(failure);
      if (error.status === 429) setCooldown(error.retryAfter);
      if (error.status === 409) {
        formRef.current?.form.setError(
          "repo_url",
          { type: "server", message: error.userMessage },
          { shouldFocus: true },
        );
        return;
      }
      toast.error(error.userMessage);
    }
  }

  return (
    <GenericForm
      ref={formRef}
      schema={submissionSchema}
      initialValues={INITIAL_VALUES}
      onSubmit={submit}
      className="space-y-6"
    >
      <fieldset disabled={mutation.isPending} className="space-y-5">
        <TextField
          name="project_name"
          label="Project name"
          placeholder="e.g. E-commerce dashboard"
          required
          autoComplete="off"
        />
        <TextareaField
          name="description"
          label="Description"
          placeholder="What did you build? What problems does it solve?"
          required
          rows={5}
          inputClassName="min-h-32"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="repo_url"
            label="Repository URL"
            placeholder="https://github.com/you/project"
            required
            autoComplete="off"
          />
          <TextField
            name="live_link"
            label="Live link (optional)"
            placeholder="https://your-project.vercel.app"
            autoComplete="off"
          />
        </div>
      </fieldset>
      <div className="flex justify-end border-t border-border pt-6">
        <SubmitButton
          label={cooldown > 0 ? `Try again in ${cooldown}s` : "Submit project"}
          loadingLabel="Submitting..."
          disabled={cooldown > 0}
          width="auto"
          className="w-full sm:w-auto"
        />
      </div>
    </GenericForm>
  );
}
