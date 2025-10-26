import express from "express";
import { registerAdmin, loginAdmin, getAllAdmins } from "../controllers/admin.controller.js";
import authorize from "../middlewares/Authmiddleware.js";  // Import middleware

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/getAllAdmins", authorize('admin'), getAllAdmins);  // Only accessible to admin


export default router;
