"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GenericForm,
  SubmitButton,
  TextareaField,
  TextField,
} from "@/components/reusable-ui-blocks/form";
import { Button } from "@/components/ui/button";
import { useCreateSubmission } from "@/hooks/submissions.hook";
import { routes } from "@/routes";
import type { CreateSubmissionInput } from "@/types/submissions.type";
import { z } from "zod";

const submissionSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  repo_url: z.string().url("Enter a valid repository URL"),
  live_link: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

const initialValues: SubmissionFormValues = {
  project_name: "",
  description: "",
  repo_url: "",
  live_link: "",
};

export function SubmissionForm() {
  const mutation = useCreateSubmission();
  const router = useRouter();

  async function handleSubmit(values: SubmissionFormValues) {
    if (mutation.isPending) return;
    const input: CreateSubmissionInput = {
      project_name: values.project_name,
      repo_url: values.repo_url,
      description: values.description,
      ...(values.live_link ? { live_link: values.live_link } : {}),
    };
    await mutation.mutateAsync(input);
    router.replace(routes.submissions);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="eyebrow mb-3">New submission</p>
        <h1 className="text-display-lg tracking-[-0.04em]">
          Submit your project
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Share your work with your mentor for review and feedback.
        </p>
      </div>

      <GenericForm
        schema={submissionSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
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
              label="Live demo URL"
              placeholder="https://your-project.vercel.app"
              autoComplete="off"
            />
          </div>
        </fieldset>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Button asChild variant="ghost" size="xl">
            <Link href={routes.dashboard}>Cancel</Link>
          </Button>
          <SubmitButton
            label="Submit project"
            loadingLabel="Submitting..."
            width="auto"
            className="w-full sm:w-auto"
          />
        </div>
      </GenericForm>
    </div>
  );
}
