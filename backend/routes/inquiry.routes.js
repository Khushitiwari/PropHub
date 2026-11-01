// Buyer/seller inquiry endpoints.

import express from "express";
import { authorize, protect } from "../middlewares/auth.js";
import {
  sendInquiry,
  getSellerInquiries,
  markAsRead,
} from "../controllers/inquiry.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  sendInquirySchema,
  inquiryIdParamsSchema,
} from "../validation/inquiry.schema.js";

const inquiryRouter = express.Router();

inquiryRouter.post(
  "/",
  protect,
  authorize("buyer"),
  validate({ body: sendInquirySchema }),
  sendInquiry,
);
inquiryRouter.get(
  "/seller",
  protect,
  authorize("seller"),
  getSellerInquiries,
);

inquiryRouter.patch(
  "/:id/read",
  protect,
  validate({ params: inquiryIdParamsSchema }),
  markAsRead,
);
export default inquiryRouter;
