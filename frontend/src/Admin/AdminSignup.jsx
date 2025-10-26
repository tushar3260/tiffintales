import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast';
import AdminContext from "./context/AdminContext"; // Adjust path if needed
import { storage } from "../utils/Storage";

export default function AdminSignup() {
  const navigate = useNavigate();
  const { setAdmin, setAdminToken } = useContext(AdminContext);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const { username, email, phone, password } = form;

    if (!username || !email || !phone || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/admins/register`,
        { username, email, phone, password },
        { withCredentials: true }
      );

      console.log("✅ Admin Signup Response:", res.data);

      const { admin, token } = res.data;

      if (!token || !admin) {
        toast.error("❌ Signup failed: No token or admin data");
        return;
      }

      storage.setItem("AdminToken", token);
      storage.setItem("AdminData", admin);
      console.log("🧠 Saved Admin:", storage.getItem("AdminData"));
      console.log("🔐 Saved Token:", storage.getItem("AdminToken"));

      setAdmin(admin);
      setAdminToken(token);

      toast.success("Signup successful!");

      setTimeout(() => {
        window.location.href = "/otp?role=admin";
      }, 1500);
    } catch (err) {
      console.error("❌ Signup Error:", err.response || err.message);
      toast.error(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white rounded-3xl shadow-xl px-10 py-12 w-full max-w-sm">
        <h2 className="text-3xl font-bold text-orange-600 text-center mb-8">
          Admin Sign Up
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className={`w-full bg-orange-500 text-white py-3 rounded-xl text-lg font-semibold transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
          }`}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/admin/secure/tales/login")}
            disabled={loading}
            className="text-orange-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
