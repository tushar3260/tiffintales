import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import dotenv from "dotenv";
import User from "../models/User.js";
import Chef from "../models/Chef.js";
import Admin from "../models/admin.js";
// dns import removed — was unused and caused a server crash

dotenv.config();

// 🚀 Initialize Resend (FREE!)
const resend = new Resend(process.env.RESEND_API_KEY);

// 🔧 Get model dynamically based on role
const getModelByRole = (role) => {
  const models = { user: User, chef: Chef, admin: Admin };
  return models[role] || null;
};

// ✅ Step 1: Send Reset Link to Email
export const forgotPassword = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role)
    return res.status(400).json({ message: "Email and role are required." });

  const Model = getModelByRole(role);
  if (!Model) return res.status(400).json({ message: "Invalid role." });

  try {
    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}?role=${role}`;

    // 📧 Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Tiffin Tales <noreply@tiffintalesindia.me>', // Use your domain
      to: [user.email],
      subject: '🔐 Reset Your Password - Tiffin Tales',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%); padding: 40px 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #e9ecef;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #f1f3f4;">
              <div style="background: linear-gradient(135deg, #e63946, #dc2626); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 32px; font-weight: bold; margin-bottom: 8px;">
                🍱 Tiffin Tales
              </div>
              <p style="color: #6c757d; margin: 0; font-size: 14px; font-weight: 500;">
                Delicious Food, Delivered Fresh
              </p>
            </div>
            
            <!-- Greeting -->
            <div style="margin-bottom: 30px;">
              <h2 style="color: #212529; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                Hello 👋
              </h2>
              <p style="color: #495057; line-height: 1.6; margin: 0; font-size: 16px;">
                We received a request to reset your password for your <strong style="color: #e63946;">Tiffin Tales</strong> account.
              </p>
            </div>
            
            <!-- Instructions -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #e63946;">
              <p style="color: #495057; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Click the button below to create a new password:
              </p>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="${resetLink}" 
                   style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #e63946 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 25px rgba(230, 57, 70, 0.3); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;">
                  🔐 Reset My Password
                </a>
              </div>
            </div>
            
            <!-- Warning Box -->
            <div style="background: linear-gradient(135deg, #fff3cd 0%, #fef7e0 100%); padding: 20px; border-radius: 10px; margin: 30px 0; border: 1px solid #ffeaa7;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 20px; margin-right: 10px;">⏰</span>
                <strong style="color: #856404; font-size: 16px;">Important Security Notice</strong>
              </div>
              <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
                This reset link will expire in <strong>10 minutes</strong> for your security. If you need a new link, please request another password reset.
              </p>
            </div>
            
            <!-- Security Note -->
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #e7f3ff; border-radius: 10px; border: 1px solid #b8daff;">
              <p style="color: #004085; margin: 0; font-size: 14px; line-height: 1.5;">
                🛡️ <strong>Didn't request this?</strong><br>
                If you didn't request a password reset, please ignore this email. Your password will remain unchanged and your account stays secure.
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
              You received this email because a password reset was requested for your account.<br>
              Questions? Contact us at <a href="mailto:support@tiffintales.com" style="color: #e63946; text-decoration: none;">support@tiffintales.com</a>
            </p>
          </div>
        </div>
      `,
      // Plain text version for better compatibility
      text: `
Hello!

You requested a password reset for your Tiffin Tales account.

Reset your password by clicking this link: ${resetLink}

IMPORTANT: This link will expire in 10 minutes for your security.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Need help? Contact us at support@tiffintales.com

Best regards,
Team Tiffin Tales 🍱
Making delicious homemade food accessible to everyone

© 2025 Tiffin Tales. All rights reserved.
      `
    });

    // Handle Resend errors
    if (error) {
      console.error('❌ Resend API Error:', error);
      
      // Log specific error details
      if (error.name === 'validation_error') {
        console.error('🚫 Validation Error: Check email format and required fields');
      } else if (error.name === 'missing_required_field') {
        console.error('⚠️ Missing Required Field:', error.message);
      } else if (error.name === 'invalid_access') {
        console.error('🔑 Invalid API Key or insufficient permissions');
      }
      
      return res.status(500).json({ 
        message: "Failed to send reset email. Please try again later.",
        success: false,
        ...(process.env.NODE_ENV === 'development' && { 
          error: error.message,
          errorName: error.name 
        })
      });
    }

    console.log('✅ Password reset email sent successfully via Resend');
    console.log('📧 Email ID:', data.id);
    
    res.status(200).json({ 
      message: "Reset link sent to email!",
      success: true,
      emailId: data.id // For tracking purposes
    });

  } catch (error) {
    console.error("❌ Server error in forgotPassword:", error);
    res.status(500).json({ 
      message: "Server error. Please try again later.",
      success: false 
    });
  }
};

// ✅ Step 2: Reset Password via Token
export const resetPassword = async (req, res) => {
  const { token, role, newPassword } = req.body;

  if (!token || !role || !newPassword)
    return res
      .status(400)
      .json({ message: "Token, role, and new password are required." });

  const Model = getModelByRole(role);
  if (!Model) return res.status(400).json({ message: "Invalid role." });

  try {
    const user = await Model.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user with new password and clear reset tokens
    user.passwordHash = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    console.log("✅ Password reset successful for user:", user.email);
    
    // 🎉 Send success confirmation email (optional)
    if (process.env.SEND_CONFIRMATION_EMAIL === 'true') {
      try {
        const { data: confirmData, error: confirmError } = await resend.emails.send({
          from: 'Tiffin Tales <noreply@tiffintalesindia.me>',
          to: [user.email],
          subject: '✅ Password Reset Successful - Tiffin Tales',
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); padding: 40px 30px; border-radius: 15px; text-align: center; border: 1px solid #c3e6cb;">
                
                <div style="margin-bottom: 30px;">
                  <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                  <h2 style="color: #155724; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
                    Password Reset Successful!
                  </h2>
                  <div style="width: 60px; height: 3px; background: #28a745; margin: 15px auto; border-radius: 2px;"></div>
                </div>
                
                <div style="background: #ffffff; padding: 25px; border-radius: 10px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                  <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                    Great news! Your password has been successfully updated for your <strong style="color: #e63946;">Tiffin Tales</strong> account.
                  </p>
                  <p style="color: #6c757d; font-size: 14px; margin: 0;">
                    You can now log in with your new password and continue enjoying delicious meals!
                  </p>
                </div>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #ffeaa7;">
                  <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
                    🛡️ <strong>Security Tip:</strong> If you didn't make this change, please contact our support team immediately at 
                    <a href="mailto:support@tiffintales.com" style="color: #e63946; text-decoration: none; font-weight: 600;">support@tiffintales.com</a>
                  </p>
                </div>
                
                <div style="margin-top: 30px;">
                  <p style="color: #28a745; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                    Team Tiffin Tales 🍱
                  </p>
                  <p style="color: #6c757d; margin: 0; font-size: 12px;">
                    Making delicious food accessible to everyone
                  </p>
                </div>
              </div>
            </div>
          `,
          text: `
Password Reset Successful!

Great news! Your password has been successfully updated for your Tiffin Tales account.

You can now log in with your new password.

Security Note: If you didn't make this change, please contact support@tiffintales.com immediately.

Team Tiffin Tales 🍱
          `
        });
        
        if (!confirmError) {
          console.log("✅ Password reset confirmation email sent:", confirmData.id);
        } else {
          console.error("⚠️ Failed to send confirmation email:", confirmError);
        }
      } catch (confirmError) {
        console.error("⚠️ Confirmation email error:", confirmError);
        // Don't fail the request if confirmation email fails
      }
    }

    res.status(200).json({ 
      message: "Password reset successful! You can now log in with your new password.",
      success: true 
    });
    
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ 
      message: "Server error. Try again later.",
      success: false 
    });
  }
};

// 🔧 Utility: Send Welcome Email (bonus function)
export const sendWelcomeEmail = async (user, role) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Tiffin Tales <welcome@tiffintales.com>',
      to: [user.email],
      subject: '🎉 Welcome to Tiffin Tales Family!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%); padding: 40px 30px; border-radius: 15px; text-align: center;">
            <h1 style="color: #e63946; font-size: 28px; margin-bottom: 20px;">
              🎉 Welcome to Tiffin Tales! 🍱
            </h1>
            <p style="color: #495057; font-size: 16px; line-height: 1.6;">
              Hi <strong>${user.name || 'Food Lover'}</strong>! 👋<br>
              Welcome to the Tiffin Tales family as a <strong>${role}</strong>!
            </p>
            <p style="color: #6c757d; font-size: 14px; margin-top: 20px;">
              Get ready to experience the best homemade food delivered fresh to your doorstep! 🚚✨
            </p>
          </div>
        </div>
      `
    });

    if (!error) {
      console.log("✅ Welcome email sent successfully:", data.id);
      return true;
    } else {
      console.error("❌ Welcome email failed:", error);
      return false;
    }
  } catch (error) {
    console.error("❌ Welcome email error:", error);
    return false;
  }
};
