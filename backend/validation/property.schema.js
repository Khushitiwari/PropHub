// Property create/update, filters, and param ids for /api/property

import { z } from "zod";
import {
  furnishingSchema,
  objectIdParamSchema,
  objectIdSchema,
  propertyStatusSchema,
  propertyTypeSchema,
} from "./common.schema.js";

// Shared fields for POST and PUT (FormData sends strings — coerce numbers)
const propertyFieldsSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(200),
  description: z.string().trim().min(10, "Description is too short").max(5000),
  price: z.coerce.number().positive("Price must be greater than 0"),
  city: z.string().trim().min(2, "City is required").max(100),
  area: z.string().trim().min(2, "Area is required").max(200),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pincode must be 6 digits"),
  propertyType: propertyTypeSchema,
  bhk: z.string().trim().max(10).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  areaSize: z.coerce.number().positive().optional(),
  furnishing: furnishingSchema.optional(),
  status: propertyStatusSchema.optional(),
  securityDeposit: z.coerce.number().min(0).optional(),
  maintenance: z.coerce.number().min(0).optional(),
});

// POST / — seller creates listing
export const createPropertySchema = propertyFieldsSchema;

// PUT /:id — seller sends full form again (same rules as create)
export const updatePropertySchema = propertyFieldsSchema;

export const propertyIdParamsSchema = objectIdParamSchema;

// PATCH /:id/status
export const updatePropertyStatusSchema = z.object({
  status: propertyStatusSchema,
});

// GET / — optional query filters (all strings from URL)
export const propertyListQuerySchema = z.object({
  city: z.string().trim().max(100).optional(),
  area: z.string().trim().max(200).optional(),
  pincode: z.string().trim().max(10).optional(),
  propertyType: z.string().trim().max(200).optional(),
  bhk: z.string().trim().max(10).optional(),
  furnishing: z.string().trim().max(200).optional(),
  status: propertyStatusSchema.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  amenities: z.string().trim().max(500).optional(),
  sort: z.enum(["priceLow", "priceHigh", "latest"]).optional(),
  seller: objectIdSchema.optional(),
});
