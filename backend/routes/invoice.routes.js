import express from "express";
import { createInvoice, deleteInvoice, getInvoiceById, getInvoices, updateInvoice } from "../controllers/invoice.controllers.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/", protect, createInvoice);
router.get("/", protect, getInvoices);
router.get("/:id", protect, getInvoiceById);
router.put("/:id", protect, updateInvoice);
router.delete("/:id", protect, deleteInvoice);

export default router;