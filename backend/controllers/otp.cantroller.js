import { Resend } from 'resend';
import dotenv from 'dotenv';
import Admin from '../models/admin.js';
import User from '../models/User.js';
import Chef from '../models/Chef.js';
import Otp from '../models/otp.model.js';

dotenv.config();

// 🚀 Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// 🔧 Select model by role
const getModelByRole = (role) => {
  const models = {
    admin: Admin,
    user: User,
    chef: Chef,
  };
  return models[role] || null;
};

// ✅ Send OTP
export const sendOTP = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: 'Email and role are required.' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  console.log('🔍 Sending OTP:', { email, role, otp: otp.substring(0, 3) + '***' });

  try {
    // Save OTP to database
    await Otp.findOneAndUpdate(
      { email },
      { email, otp, role, expiresAt, isVerified: false },
      { upsert: true, new: true }
    );

    console.log('✅ OTP saved to database');

    // 📧 Send OTP email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Tiffin Tales <noreply@tiffintalesindia.me>', // Use your verified domain
      to: [email],
      subject: '🔐 Your OTP Verification Code - Tiffin Tales',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%); padding: 40px 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #e9ecef;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #f1f3f4;">
              <div style="color: #e63946; font-size: 32px; font-weight: bold; margin-bottom: 8px;">
                🍱 Tiffin Tales
              </div>
              <p style="color: #6c757d; margin: 0; font-size: 14px; font-weight: 500;">
                Delicious Food, Delivered Fresh
              </p>
            </div>
            
            <!-- Greeting -->
            <div style="margin-bottom: 30px;">
              <h2 style="color: #212529; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                Hey foodie! 👋
              </h2>
              <p style="color: #495057; line-height: 1.6; margin: 0; font-size: 16px;">
                Your One-Time Password (OTP) for <strong style="color: #e63946;">Tiffin Tales</strong> verification is:
              </p>
            </div>
            
            <!-- OTP Display -->
            <div style="text-align: center; margin: 40px 0;">
              <div style="background: linear-gradient(135deg, #e63946 0%, #dc2626 100%); color: #ffffff; padding: 25px 40px; border-radius: 15px; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace; box-shadow: 0 8px 25px rgba(230, 57, 70, 0.3); display: inline-block;">
                ${otp}
              </div>
            </div>
            
            <!-- Timer Warning -->
            <div style="background: linear-gradient(135deg, #fff3cd 0%, #fef7e0 100%); padding: 20px; border-radius: 10px; margin: 30px 0; border: 1px solid #ffeaa7;">
              <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                <span style="font-size: 20px; margin-right: 10px;">⏰</span>
                <strong style="color: #856404; font-size: 16px;">Time Sensitive!</strong>
              </div>
              <p style="color: #856404; margin: 0; font-size: 14px; text-align: center; line-height: 1.5;">
                This OTP is valid for the next <strong>5 minutes</strong> only.<br>
                Don't share this code with anyone for security reasons.
              </p>
            </div>
            
            <!-- Security Note -->
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #e7f3ff; border-radius: 10px; border: 1px solid #b8daff;">
              <p style="color: #004085; margin: 0; font-size: 14px; line-height: 1.5;">
                🛡️ <strong>Security Reminder:</strong><br>
                If you didn't request this OTP, please ignore this email and contact our support team immediately.
              </p>
            </div>
            
            <!-- Divider -->
            <hr style="margin: 40px 0; border: none; border-top: 1px solid #dee2e6;">
            
            <!-- Footer -->
            <div style="text-align: center;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #e63946; font-size: 16px;">Team Tiffin Tales 🍱</strong>
              </div>
              <p style="color: #6c757d; margin: 0 0 10px 0; font-size: 14px; line-height: 1.5;">
                Making delicious homemade food accessible to everyone<br>
                Bringing the taste of home to your doorstep
              </p>
              <p style="color: #adb5bd; margin: 0; font-size: 12px;">
                © 2025 Tiffin Tales. All rights reserved.
              </p>
            </div>
          </div>
          
          <!-- Footer Note -->
          <div style="text-align: center; margin-top: 20px; padding: 15px;">
            <p style="color: #6c757d; font-size: 11px; margin: 0; line-height: 1.4;">
              This is an automated message for account verification.<br>
              Questions? Contact us at <a href="mailto:support@tiffintales.com" style="color: #e63946; text-decoration: none;">support@tiffintales.com</a>
            </p>
          </div>
        </div>
      `,
      // Plain text version for better compatibility
      text: `
Tiffin Tales - OTP Verification

Hey foodie!

Your One-Time Password (OTP) for Tiffin Tales verification is: ${otp}

IMPORTANT: This OTP is valid for 5 minutes only.

Do not share this code with anyone for security reasons.

If you didn't request this OTP, please ignore this email.

Team Tiffin Tales 🍱
Making delicious homemade food accessible to everyone

© 2025 Tiffin Tales. All rights reserved.
      `
    });

    // Handle Resend errors
    if (error) {
      console.error('❌ Resend OTP Error:', error);
      
      // Log specific error details
      if (error.name === 'validation_error') {
        console.error('🚫 Validation Error: Check email format and domain');
      } else if (error.name === 'missing_required_field') {
        console.error('⚠️ Missing Required Field:', error.message);
      } else if (error.name === 'invalid_access') {
        console.error('🔑 Invalid API Key or insufficient permissions');
      }
      
      return res.status(500).json({
        message: 'Failed to send OTP. Please try again.',
        success: false,
        ...(process.env.NODE_ENV === 'development' && { 
          error: error.message,
          errorName: error.name 
        })
      });
    }

    console.log('✅ OTP email sent successfully via Resend');
    console.log('📧 Email ID:', data.id);

    res.status(200).json({ 
      message: 'OTP sent successfully to your email!',
      success: true,
      emailId: data.id,
      expiresIn: '5 minutes'
    });

  } catch (error) {
    console.error('❌ Error sending OTP:', error);
    res.status(500).json({ 
      message: 'Failed to send OTP. Please try again.',
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ Verify OTP (unchanged - only database logic)
export const verifyOTP = async (req, res) => {
  const { email, otp, role } = req.body;

  if (!email || !otp || !role) {
    return res.status(400).json({ message: 'Email, OTP, and role are required.' });
  }

  console.log('🔍 Verifying OTP:', { email, role, otp: otp.substring(0, 3) + '***' });

  try {
    const record = await Otp.findOne({ email });

    if (!record || record.role !== role) {
      console.log('❌ OTP not found or role mismatch');
      return res.status(400).json({ message: 'OTP not found or role mismatch.' });
    }

    if (record.isVerified) {
      console.log('❌ OTP already verified');
      return res.status(400).json({ message: 'OTP already verified.' });
    }

    if (record.expiresAt < new Date()) {
      console.log('❌ OTP expired');
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    }

    if (record.otp !== otp) {
      console.log('❌ Incorrect OTP provided');
      return res.status(400).json({ message: 'Incorrect OTP. Try again.' });
    }

    // Mark as verified
    record.isVerified = true;
    await record.save();

    console.log('✅ OTP verified successfully for:', email);

    // Optional: Send confirmation email
    if (process.env.SEND_OTP_CONFIRMATION === 'true') {
      try {
        const { data: confirmData, error: confirmError } = await resend.emails.send({
          from: 'Tiffin Tales <noreply@tiffintalesindia.me>',
          to: [email],
          subject: '✅ Email Verified Successfully - Tiffin Tales',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); padding: 30px; border-radius: 15px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                <h2 style="color: #155724; margin: 0 0 15px 0;">Email Verified!</h2>
                <p style="color: #495057; margin: 0;">
                  Your email has been successfully verified for Tiffin Tales!<br>
                  Welcome to our delicious food family! 🍱
                </p>
              </div>
            </div>
          `
        });
        
        if (!confirmError) {
          console.log("✅ OTP confirmation email sent:", confirmData.id);
        }
      } catch (confirmError) {
        console.error("⚠️ Failed to send OTP confirmation:", confirmError);
      }
    }

    res.status(200).json({ 
      message: 'OTP verified successfully!',
      success: true,
      verified: true
    });

  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    res.status(500).json({ 
      message: 'Internal server error during OTP verification.',
      success: false 
    });
  }
};

// 🔄 Resend OTP (Bonus feature)
export const resendOTP = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: 'Email and role are required.' });
  }

  try {
    // Check if there's an existing OTP record
    const existingRecord = await Otp.findOne({ email });
    
    if (existingRecord && !existingRecord.isVerified) {
      // Check if 1 minute has passed since last OTP
      const timeDiff = Date.now() - existingRecord.createdAt;
      if (timeDiff < 60000) { // 1 minute = 60000ms
        const waitTime = Math.ceil((60000 - timeDiff) / 1000);
        return res.status(429).json({ 
          message: `Please wait ${waitTime} seconds before requesting a new OTP.`,
          success: false,
          waitTime: waitTime
        });
      }
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Update or create OTP record
    await Otp.findOneAndUpdate(
      { email },
      { email, otp, role, expiresAt, isVerified: false, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send OTP email (reuse the same email template)
    const { data, error } = await resend.emails.send({
      from: 'Tiffin Tales <noreply@tiffintalesindia.me>',
      to: [email],
      subject: '🔄 Resend: Your OTP Verification Code - Tiffin Tales',
      html: `
        <!-- Same beautiful HTML template as above but with "Resend:" in subject -->
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #fff; padding: 30px; border-radius: 15px; text-align: center;">
            <h2 style="color: #e63946;">🍱 Tiffin Tales</h2>
            <h3 style="color: #333;">Resend: OTP Verification</h3>
            <div style="background: #e63946; color: white; padding: 20px; border-radius: 10px; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666;">This OTP is valid for <strong>5 minutes</strong>.</p>
            <p style="color: #999; font-size: 12px;">Team Tiffin Tales 🍱</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Resend OTP Error:', error);
      return res.status(500).json({
        message: 'Failed to resend OTP. Please try again.',
        success: false
      });
    }

    console.log('✅ OTP resent successfully:', data.id);

    res.status(200).json({
      message: 'OTP resent successfully to your email!',
      success: true,
      emailId: data.id
    });

  } catch (error) {
    console.error('❌ Error resending OTP:', error);
    res.status(500).json({
      message: 'Failed to resend OTP. Please try again.',
      success: false
    });
  }
};
