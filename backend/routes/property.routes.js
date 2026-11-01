// Public and seller property endpoints.

import express from "express";

import {
  getAllProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  updatedPropertyStatus,
  getPropertyCounts,
  getPropertiesDetails,
  getSellerDashboard,
  getMyProperties,
} from "../controllers/property.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createPropertySchema,
  updatePropertySchema,
  propertyIdParamsSchema,
  updatePropertyStatusSchema,
  propertyListQuerySchema,
} from "../validation/property.schema.js";

const propertyRouter = express.Router();

propertyRouter.get(
  "/",
  validate({ query: propertyListQuerySchema }),
  getAllProperties,
);

propertyRouter.post(
  "/",
  protect,
  authorize("seller"),
  upload.array("images", 10),
  validate({ body: createPropertySchema }),
  addProperty,
);
propertyRouter.get("/my", protect, authorize("seller"), getMyProperties);
propertyRouter.put(
  "/:id",
  protect,
  authorize("seller"),
  upload.array("images", 10),
  validate({ params: propertyIdParamsSchema, body: updatePropertySchema }),
  updateProperty,
);

propertyRouter.delete(
  "/:id",
  protect,
  authorize("seller"),
  validate({ params: propertyIdParamsSchema }),
  deleteProperty,
);
propertyRouter.patch(
  "/:id/status",
  protect,
  authorize("seller"),
  validate({
    params: propertyIdParamsSchema,
    body: updatePropertyStatusSchema,
  }),
  updatedPropertyStatus,
);

propertyRouter.get("/counts", getPropertyCounts);

propertyRouter.get(
  "/seller/dashboard",
  protect,
  authorize("seller"),
  getSellerDashboard,
);

propertyRouter.get(
  "/:id",
  validate({ params: propertyIdParamsSchema }),
  getPropertiesDetails,
);

export default propertyRouter;
