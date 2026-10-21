import { z } from "zod";

export const RegisterSchema = z.object({
	name: z
		.string({ required_error: "Name is required" })
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be at most 100 characters"),
	email: z
		.string({ required_error: "Email is required" })
		.email("Invalid email format")
		.max(255, "Email must be at most 255 characters"),
	password: z
		.string({ required_error: "Password is required" })
		.min(6, "Password must be at least 6 characters")
		.max(255, "Password must be at most 255 characters"),
});

export const LoginSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.email("Invalid email format"),
	password: z
		.string({ required_error: "Password is required" }),
});
