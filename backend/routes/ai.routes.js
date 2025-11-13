import express from "express";
import { protect } from "../middlewares/auth.middlewares.js";
import {
  getDashboardSummary,
  getReminderEmail,
  parseInvoiceFromText,
} from "../controllers/ai.controllers.js";

const router = express.Router();

router.post("/parse-text", protect, parseInvoiceFromText);
router.post("/generate-reminder/", protect, getReminderEmail);
router.get("/dashboard-summary", protect, getDashboardSummary);

export default router;
