// Contact form and admin listing.

import express from "express";
import { authorize, protect } from "../middlewares/auth.js";
import { getAllContacts, createContact } from "../controllers/contact.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createContactSchema } from "../validation/contact.schema.js";

const contactRouter = express.Router();

contactRouter.post(
  "/",
  validate({ body: createContactSchema }),
  createContact,
);
contactRouter.get("/", protect, authorize("admin"), getAllContacts);

export default contactRouter;
