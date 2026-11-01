// Profile routes under /api/user.

import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getProfile,
  getPublicProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  updateProfileSchema,
  publicProfileParamsSchema,
} from "../validation/user.schema.js";

const userRouter = express.Router();

userRouter.get("/profile", protect, getProfile);
userRouter.put(
  "/profiles",
  protect,
  upload.single("profilePic"),
  validate({ body: updateProfileSchema }),
  updateProfile,
);
userRouter.get(
  "/public/:id",
  validate({ params: publicProfileParamsSchema }),
  getPublicProfile,
);

export default userRouter;
