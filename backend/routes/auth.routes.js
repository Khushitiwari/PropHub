// Maps /api/auth to auth.controller handlers.

import express from "express";
import {
  register,
  login,
  getMe,
  resetPassword,
  forgotPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordParamsSchema,
  resetPasswordBodySchema,
} from "../validation/auth.schema.js";

const authRouter = express.Router();

authRouter.post("/register", validate({ body: registerSchema }), register);
authRouter.post("/login", validate({ body: loginSchema }), login);

authRouter.get("/me", protect, getMe);
authRouter.post(
  "/verify-email",
  validate({ body: verifyEmailSchema }),
  verifyEmail,
);

authRouter.post(
  "/forgot-password",
  validate({ body: forgotPasswordSchema }),
  forgotPassword,
);
authRouter.post(
  "/reset-password/:token",
  validate({
    params: resetPasswordParamsSchema,
    body: resetPasswordBodySchema,
  }),
  resetPassword,
);

export default authRouter;
