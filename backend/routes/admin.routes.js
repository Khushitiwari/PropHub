
import express from  'express';
import { protect , authorize } from '../middlewares/auth.js';
import { getAllUsers, getAllInquiries, getAllProperties, getDashboardStats, getPendingSeller, approveSeller, blockUser , deleteProperty , deleteUser } from '../controllers/admin.controller.js';

const adminRouter = express.Router();

// pure admin router ko hi protect middleware s wrap krr diya
adminRouter.use(protect , authorize("admin"));

adminRouter.get("/users" , getAllUsers);
adminRouter.patch("/users/:id/block" , blockUser);
adminRouter.delete("/users/:id" , deleteUser);

adminRouter.get("/properties" , getAllProperties);
adminRouter.delete("/properties/:id" , deleteProperty);


adminRouter.get("/inquiries" , getAllInquiries);

adminRouter.get("/stats" , getDashboardStats);

adminRouter.get("/pending-sellers" , getPendingSeller);
adminRouter.patch("/approve-seller/:id" , approveSeller);



export default adminRouter;