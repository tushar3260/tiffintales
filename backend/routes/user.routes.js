// routes/user.routes.js में add करें
import express from "express";
import {
  UserLogin,
  UserSignUp,
  getallUsers,
  toggleBlockStatus,
  updateProfile,
  GoogleAuth // ✅ Add this import
} from "../controllers/user.controller.js";
import {
  addUserAddress,
  getUserAddresses,
} from "../controllers/addlocation.controller.js";
import authorize from "../middlewares/Authmiddleware.js";

const router = express.Router();

// ✅ Public routes
router.post("/login", UserLogin);
router.post("/signup", UserSignUp);
router.post("/google-login", GoogleAuth); // ✅ Add this route

// ✅ User address routes
router.post("/:id/address", addUserAddress);
router.get("/:id/address", getUserAddresses);

// ✅ Admin-only routes
router.get("/getallusers", authorize("admin"), getallUsers);
router.put("/toggleBlock/:id", authorize("admin"), toggleBlockStatus);
router.put("/update", authorize("user"), updateProfile);

export default router;
