"use client";

import Link from "next/link";
import { useState } from "react";
import { AttachmentField } from "@/components/reusable-ui-blocks/attachment/AttachmentField";
import {
  GenericForm,
  SelectField,
  SubmitButton,
  TextareaField,
  TextField,
} from "@/components/reusable-ui-blocks/form";
import { Button } from "@/components/ui/button";
import { routes } from "@/routes";
import { z } from "zod";

const CATEGORIES = [
  { value: "frontend", text: "Frontend" },
  { value: "backend", text: "Backend" },
  { value: "fullstack", text: "Full Stack" },
  { value: "mobile", text: "Mobile" },
  { value: "other", text: "Other" },
];

const submissionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  githubUrl: z.string().url("Enter a valid GitHub URL"),
  liveUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  notes: z.string().optional(),
});

type SubmissionInput = z.infer<typeof submissionSchema>;

const initialValues: SubmissionInput = {
  title: "",
  description: "",
  githubUrl: "",
  liveUrl: "",
  category: "",
  notes: "",
};

export function SubmissionForm() {
  const [attachments, setAttachments] = useState<File[]>([]);

  function handleSubmit(_values: SubmissionInput) {
    // API integration comes later
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
        <fieldset className="space-y-5">
          <TextField
            name="title"
            label="Project title"
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
              name="githubUrl"
              label="GitHub repository"
              placeholder="https://github.com/you/project"
              required
              autoComplete="off"
            />
            <TextField
              name="liveUrl"
              label="Live demo URL"
              placeholder="https://your-project.vercel.app"
              autoComplete="off"
            />
          </div>

          <SelectField
            name="category"
            label="Category"
            required
            placeholder="Select a category"
            options={CATEGORIES}
          />

          <TextareaField
            name="notes"
            label="Notes for mentor"
            placeholder="Anything you'd like your mentor to focus on or know?"
            rows={3}
          />
        </fieldset>

        <div className="space-y-3">
          <div>
            <p className="text-sm leading-5 font-medium">Attachments</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Optional. Upload screenshots, designs, or any supporting files.
            </p>
          </div>
          <AttachmentField
            files={attachments}
            accept="image/*,.pdf,.zip"
            maxSizeKb={10 * 1024}
            onAdd={(files) => setAttachments((prev) => [...prev, ...files])}
            onRemove={(file) =>
              setAttachments((prev) => prev.filter((f) => f !== file))
            }
          />
        </div>

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
