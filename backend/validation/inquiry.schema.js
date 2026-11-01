// Buyer inquiries under /api/inquiry

import { z } from "zod";
import { objectIdParamSchema, objectIdSchema } from "./common.schema.js";

// POST / — buyer sends message about a property
export const sendInquirySchema = z.object({
  propertyId: objectIdSchema,
  message: z
    .string()
    .trim()
    .min(5, "Message is too short")
    .max(2000, "Message is too long"),
});

// PATCH /:id/read
export const inquiryIdParamsSchema = objectIdParamSchema;
