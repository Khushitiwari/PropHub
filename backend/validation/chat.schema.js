// Chat REST routes under /api/chat

import { z } from "zod";
import { objectIdSchema } from "./common.schema.js";

// POST /start — buyer or seller starts thread
export const startChatSchema = z.object({
  propertyId: objectIdSchema.optional(),
  sellerId: objectIdSchema.optional(),
  buyerId: objectIdSchema.optional(),
});

// POST /send
export const sendChatMessageSchema = z.object({
  chatId: objectIdSchema,
  text: z.string().trim().max(5000).optional(),
  image: z.string().trim().max(2000).optional(),
}).refine(
  (data) =>
    (data.text && data.text.trim().length > 0) ||
    (data.image && data.image.trim().length > 0),
  { message: "Message text or image is required", path: ["text"] },
);

export const chatIdParamsSchema = z.object({
  chatId: objectIdSchema,
});

export const chatMessageParamsSchema = z.object({
  chatId: objectIdSchema,
  messageId: objectIdSchema,
});
