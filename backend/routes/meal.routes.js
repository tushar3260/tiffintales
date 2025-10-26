import express from 'express';
import {
  createMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getMealByChefId,
  applyDiscountToMeals,
  getDiscountedMeals
} from '../controllers/meal.controller.js';

const router = express.Router();

router.post("/create", createMeal);
router.get("/", getAllMeals);

// ✅ Static routes first
router.get("/discounted", getDiscountedMeals); // Only once
router.post("/apply-discount", applyDiscountToMeals);

// ✅ Dynamic routes after static ones
router.get("/chef/:chefId", getMealByChefId);
router.get("/:id", getMealById);
router.put("/:id", updateMeal);
router.delete("/:id", deleteMeal);

export default router;
