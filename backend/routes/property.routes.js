import express from 'express';

import { getAllProperties,  addProperty, updateProperty, deleteProperty, updatedPropertyStatus, getPropertyCounts ,getPropertiesDetails, getSellerDashboard , getMyProperties } from '../controllers/property.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { protect, authorize } from '../middlewares/auth.js';
const propertyRouter = express.Router();

propertyRouter.get("/" , getAllProperties);

// protect the routes that only seller can do these works
propertyRouter.post("/" , protect , authorize('seller') , upload.array("images" , 10) , addProperty);
propertyRouter.get("/my" , protect , authorize('seller') , getMyProperties);
propertyRouter.put("/:id" , protect , authorize('seller') , upload.array("images" , 10) , updateProperty); // pura update karne ke liye put

propertyRouter.delete("/:id" , protect , authorize('seller') , deleteProperty);
propertyRouter.patch("/:id/status" , protect , authorize('seller') , updatedPropertyStatus); // update status only ke liye patch

propertyRouter.get("/counts" , getPropertyCounts);

propertyRouter.get("/seller/dashboard" , protect , authorize("seller") , getSellerDashboard);


propertyRouter.get("/:id" , getPropertiesDetails);


export default propertyRouter;