import { z } from "zod";

const email = z.email("Invalid email address").max(255);

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});
