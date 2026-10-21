import { z } from "zod";

export const CreateSubmissionSchema = z.object({
	project_name: z
		.string({ error: "Project name is required" })
		.min(2, "Project name must be at least 2 characters")
		.max(100, "Project name must be at most 100 characters"),
	repo_url: z
		.string({ error: "Repository URL is required" })
		.url("Invalid URL format")
		.max(500, "Repository URL must be at most 500 characters")
		.refine((url) => url.startsWith("https://github.com/"), {
			message: "Repository URL must start with https://github.com/",
		}),
	live_link: z
		.string()
		.url("Invalid URL format")
		.max(500, "Live link must be at most 500 characters")
		.optional(),
	description: z
		.string({ error: "Description is required" })
		.min(10, "Description must be at least 10 characters")
		.max(500, "Description must be at most 500 characters"),
});

export const ReviewSubmissionSchema = z.object({
	status: z.enum(["APPROVED", "REJECTED"], {
		error: "Status must be APPROVED or REJECTED",
	}),
	comment: z.string().max(500, "Comment must be at most 500 characters").optional(),
});

export const QuerySubmissionsSchema = z.object({
	page: z.coerce
		.number()
		.int("Page must be an integer")
		.positive("Page must be positive")
		.optional(),
	limit: z.coerce
		.number()
		.int("Limit must be an integer")
		.positive("Limit must be positive")
		.optional(),
	status: z
		.enum(["PENDING", "APPROVED", "REJECTED"], {
			error: "Status must be PENDING, APPROVED, or REJECTED",
		})
		.optional(),
});
