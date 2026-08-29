import express from 'express' 
import { authorize , protect} from '../middlewares/auth.js';
import { getAllContacts , createContact } from '../controllers/contact.controller.js';

const contactRouter = express.Router();

contactRouter.post("/" , createContact);
contactRouter.get("/", protect, authorize("admin") , getAllContacts );

export default contactRouter;