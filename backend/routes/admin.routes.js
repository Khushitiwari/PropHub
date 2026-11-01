// All routes require admin role.

import express from "express";
import { protect, authorize } from "../middlewares/auth.js";
import {
  getAllUsers,
  getAllInquiries,
  getAllProperties,
  getDashboardStats,
  getPendingSeller,
  approveSeller,
  blockUser,
  deleteProperty,
  deleteUser,
} from "../controllers/admin.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  adminUserIdParamsSchema,
  adminPropertyIdParamsSchema,
  approveSellerParamsSchema,
} from "../validation/admin.schema.js";

const adminRouter = express.Router();

adminRouter.use(protect, authorize("admin"));

adminRouter.get("/users", getAllUsers);
adminRouter.patch(
  "/users/:id/block",
  validate({ params: adminUserIdParamsSchema }),
  blockUser,
);
adminRouter.delete(
  "/users/:id",
  validate({ params: adminUserIdParamsSchema }),
  deleteUser,
);

adminRouter.get("/properties", getAllProperties);
adminRouter.delete(
  "/properties/:id",
  validate({ params: adminPropertyIdParamsSchema }),
  deleteProperty,
);

adminRouter.get("/inquiries", getAllInquiries);

adminRouter.get("/stats", getDashboardStats);

adminRouter.get("/pending-sellers", getPendingSeller);
adminRouter.patch(
  "/approve-seller/:id",
  validate({ params: approveSellerParamsSchema }),
  approveSeller,
);

export default adminRouter;
