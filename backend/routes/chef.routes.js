import express from "express";
import {
  registerChef,
  loginChef,
  getAllChefs,
  getChefById,
  deleteChef,
  toggleApproval,
  getPublicVerifiedChefs,
  updateChef
} from "../controllers/chef.controller.js";
import authorize from "../middlewares/Authmiddleware.js";

const router = express.Router();

// ✅ Public routes
router.post("/register", registerChef);
router.post("/login", loginChef);
router.get("/verified", getPublicVerifiedChefs); // Public — no auth needed

// ✅ Static/named routes MUST be before dynamic /:id
router.get("/getAllChefs", getAllChefs);

// ✅ Protected routes
router.get("/getChefById/:id", authorize("admin", "chef"), getChefById);
router.delete("/deleteChef/:id", authorize("admin"), deleteChef);
router.put("/toggleApproval/:id", authorize("admin"), toggleApproval);

// ✅ Chef self-service routes (dynamic — must come last)
router.get("/:id", getChefById);                 // Public — for chef profile pages
router.put("/:id", authorize("chef"), updateChef); // Chef self-update

export default router;
