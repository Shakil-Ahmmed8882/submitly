import { z } from "zod";

export const submissionSchema = z.object({
  project_name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must be at most 100 characters"),
  repo_url: z
    .string()
    .trim()
    .max(500, "Repository URL is too long")
    .url("Enter a valid URL")
    .startsWith("https://github.com/", "Must start with https://github.com/"),
  live_link: z
    .string()
    .trim()
    .max(500, "Live link is too long")
    .refine((value) => value === "" || z.url().safeParse(value).success, {
      message: "Enter a valid URL",
    }),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
});

export type TSubmissionValues = z.infer<typeof submissionSchema>;
