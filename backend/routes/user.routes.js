import express from "express";
import {
  UserLogin,
  UserSignUp,
  getallUsers,
  toggleBlockStatus,
  updateProfile
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

// ✅ User address routes
router.post("/:id/address", addUserAddress);  // Add address
router.get("/:id/address", getUserAddresses); // Get addresses

// ✅ Admin-only routes
router.get("/getallusers", authorize("admin"), getallUsers);
router.put("/toggleBlock/:id", authorize("admin"), toggleBlockStatus); // New block/unblock route
router.put("/update",authorize("user"),updateProfile)
export default router;
