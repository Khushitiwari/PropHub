// Profile update and public profile routes under /api/user

import { z } from "zod";
import { objectIdParamSchema } from "./common.schema.js";

// GET /public/:id
export const publicProfileParamsSchema = objectIdParamSchema;

// PUT /profiles — multipart form fields arrive as strings; all fields optional
export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    phone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Phone must be 10 digits"),
    address: z.string().trim().max(500, "Address is too long"),
    removeProfilePic: z.enum(["true", "false"]),
  })
  .partial();
