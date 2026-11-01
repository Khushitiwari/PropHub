// Authenticated buyer wishlist.

import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  addWishlist,
  getWishlist,
  removeProperty,
} from "../controllers/wishlist.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { wishlistPropertyParamsSchema } from "../validation/wishlist.schema.js";

const wishlistRouter = express.Router();

wishlistRouter.post(
  "/:propertyId",
  protect,
  validate({ params: wishlistPropertyParamsSchema }),
  addWishlist,
);
wishlistRouter.get("/", protect, getWishlist);

wishlistRouter.delete(
  "/:propertyId",
  protect,
  validate({ params: wishlistPropertyParamsSchema }),
  removeProperty,
);

export default wishlistRouter;
