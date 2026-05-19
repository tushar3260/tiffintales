import express from 'express';
import { sendOTP, verifyOTP, resendOTP } from '../controllers/otp.cantroller.js';

const router = express.Router();

router.post('/send-otp', sendOTP);     // Send new OTP
router.post('/verify-otp', verifyOTP); // Verify OTP
router.post('/resend-otp', resendOTP); // ✅ Resend OTP (was missing)

export default router;
