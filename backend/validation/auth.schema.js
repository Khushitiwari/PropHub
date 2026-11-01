// Request body and params for /api/auth routes

import { z } from "zod";
import {
  emailSchema,
  tokenParamSchema,
  userRoleSchema,
} from "./common.schema.js";

// POST /register — name, email, password, role
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: emailSchema,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
  role: userRoleSchema,
});

// POST /login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// POST /verify-email — code is 6 digits from email
export const verifyEmailSchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

// POST /forgot-password
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// POST /reset-password/:token
export const resetPasswordParamsSchema = tokenParamSchema;

export const resetPasswordBodySchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
});
