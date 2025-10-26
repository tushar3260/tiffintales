import express from "express";
import {
  registerChef,
  loginChef,
  getAllChefs,
  getChefById,
  deleteChef,
  toggleApproval
} from "../controllers/chef.controller.js";
import authorize from "../middlewares/Authmiddleware.js";

const router = express.Router();

router.post("/register", registerChef);
router.post("/login", loginChef);
router.get("/getAllChefs", getAllChefs);
router.get("/getChefById/:id", authorize("admin", "chef"), getChefById);
router.delete("/deleteChef/:id", authorize("admin"), deleteChef);
router.put("/toggleApproval/:id", authorize("admin"), toggleApproval); // ✅ New Route

export default router;

