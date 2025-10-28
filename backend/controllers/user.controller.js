import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User SignUp
import OTP from "../models/otp.model.js";

export const UserSignUp = async (req, res) => {
  const { fullName, email, passwordHash, phone, address } = req.body;

  if (!fullName || !email || !passwordHash || !phone) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // 🛑 1. Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // 🔐 2. Ensure OTP is verified
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || !otpRecord.isVerified) {
      return res.status(401).json({ message: "OTP not verified." });
    }

    // 🔐 Optional: Check expiry again just to be paranoid
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired. Please request again." });
    }

    // ✅ 3. Proceed with signup
    const hashedPassword = await bcrypt.hash(passwordHash, 10);
    const user = new User({
      fullName,
      email,
      passwordHash: hashedPassword,
      phone,
      address,
    });

    await user.save();

    // 🧹 4. Cleanup OTP record
    await OTP.deleteOne({ email });

    // 🔑 5. Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 🍪 6. Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully.",
      user,
      token,
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User Login
export const UserLogin = async (req, res) => {
  const { email, passwordHash } = req.body;
  if (!email || !passwordHash) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Blocked check
    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked by admin" });
    }

    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user, token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Google OAuth Login - ADD THIS NEW FUNCTION
export const GoogleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    console.log('Google credential received:', credential.substring(0, 50) + '...');

    // Verify Google JWT token
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`
    );
    
    if (!response.ok) {
      console.error('Google token verification failed:', response.status);
      return res.status(401).json({ message: 'Invalid Google token' });
    }
    
    const googleUser = await response.json();
    console.log('Google user data:', googleUser);
    
    // Check if user already exists with Google ID
    let user = await User.findOne({ googleId: googleUser.sub });
    
    if (user) {
      console.log('Existing Google user found:', user.email);
      
      // Check if user is blocked
      if (user.isBlocked) {
        return res.status(403).json({ message: "User is blocked by admin" });
      }

      // Update avatar if changed
      user.avtar = googleUser.picture;
      await user.save();
      
    } else {
      // Check if user exists with same email but different provider
      const existingUser = await User.findOne({ email: googleUser.email });
      
      if (existingUser) {
        console.log('Linking Google to existing user:', existingUser.email);
        
        // Link Google account to existing user
        existingUser.googleId = googleUser.sub;
        existingUser.provider = 'google';
        existingUser.avtar = googleUser.picture;
        existingUser.isVerified = true; // Google accounts are pre-verified
        existingUser.isOtpVerified = true;
        user = existingUser;
        await user.save();
      } else {
        console.log('Creating new Google user:', googleUser.email);
        
        // Create new user from Google data
        user = new User({
          googleId: googleUser.sub,
          fullName: googleUser.name,
          email: googleUser.email,
          avtar: googleUser.picture,
          provider: 'google',
          isVerified: true,
          isOtpVerified: true, // Google users don't need OTP verification
          phone: null, // Will be collected later if needed
          role: 'user'
        });
        await user.save();
      }
    }
    
    console.log('User authenticated successfully:', user.email);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    res.status(200).json({
      message: "Google login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avtar: user.avtar,
        phone: user.phone,
        role: user.role,
        provider: user.provider || 'google',
        isVerified: user.isVerified
      },
      token
    });
    
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: "Google authentication failed", error: error.message });
  }
};

// Get all users
export const getallUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// ✅ Toggle block/unblock status (admin-only)
export const toggleBlockStatus = async (req, res) => {
  const { id } = req.params;
  const { isBlocked } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User status updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user status", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // User ID from JWT middleware
    const { fullName, phone, avtar, address } = req.body;

    // Check if userId exists
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized request" });
    }

    // Find user
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update fields if provided
    if (fullName) user.fullName = fullName.trim();
    if (phone) user.phone = phone.trim();
    if (avtar) user.avtar = avtar; // base64 or URL (ensure front-end sends correct format)

    // Address handling
    if (address) {
      if (!Array.isArray(address)) {
        return res.status(400).json({
          success: false,
          message: "Address must be an array",
        });
      }
      user.address = address;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
