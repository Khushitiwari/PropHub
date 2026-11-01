// Public contact form POST /api/contact

import { z } from "zod";
import { emailSchema, userRoleSchema } from "./common.schema.js";

export const createContactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .regex(/^[\d+\-\s()]{7,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  role: userRoleSchema.optional().default("buyer"),
  message: z
    .string()
    .trim()
    .min(10, "Message is too short")
    .max(3000, "Message is too long"),
});
