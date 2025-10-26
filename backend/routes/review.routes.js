import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewsByChef,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/create", createReview); // POST /api/reviews
router.get("/", getAllReviews); // GET /api/reviews
router.get("/chef/:chefId", getReviewsByChef); // GET /api/reviews/chef/:chefId
router.delete("/:id", deleteReview); // DELETE /api/reviews/:id

export default router;
