import express from 'express';
import { protect } from '../middlewares/auth.js'
import { addWishlist , getWishlist , removeProperty } from '../controllers/wishlist.controller.js';

const wishlistRouter = express.Router();

wishlistRouter.post("/:propertyId" , protect , addWishlist);
wishlistRouter.get("/" , protect , getWishlist);

wishlistRouter.delete("/:propertyId", protect , removeProperty);

export default wishlistRouter;
