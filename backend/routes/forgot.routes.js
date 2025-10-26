import { forgotPassword,resetPassword } from "../controllers/forgotpassword.cantroller.js";
import express from 'express';


const router = express.Router();

// Route to handle forgot password
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);
// Export the router
export default router;