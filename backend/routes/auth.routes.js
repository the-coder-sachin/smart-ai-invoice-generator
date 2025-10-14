import express from "express";
import { protect } from "../middlewares/auth.middlewares.js";
import { registerUser, loginUser, getUser, updateUser } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/user").get(protect, getUser).put(protect, updateUser);

export default router;
