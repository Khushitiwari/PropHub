// Shared Zod pieces used across multiple route schemas (IDs, roles, enums).

import { z } from "zod";

// Zod 4: use z.email() via pipe — z.string().email() is deprecated
export const emailSchema = z
  .string()
  .trim()
  .pipe(z.email({ message: "Invalid email address" }));

// MongoDB document id from URL params or body (24 hex characters)
export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid id format");

export const objectIdParamSchema = z.object({
  id: objectIdSchema,
});

export const propertyIdParamSchema = z.object({
  propertyId: objectIdSchema,
});

export const tokenParamSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
});

export const userRoleSchema = z.enum(["buyer", "seller", "admin"]);

export const propertyTypeSchema = z.enum([
  "flat",
  "apartment",
  "villa",
  "house",
  "studio",
  "penthouse",
  "office",
  "townhouse",
  "plot",
  "commercial",
]);

export const furnishingSchema = z.enum([
  "furnished",
  "semi-furnished",
  "unfurnished",
]);

export const propertyStatusSchema = z.enum(["sale", "sold"]);
