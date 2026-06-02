// Premium TopNav — Production Ready
// Clean rewrite: removed 300+ lines of dead commented code
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaBars, FaTimes, FaMapMarkerAlt, FaBell } from "react-icons/fa";
import axios from "axios";
import TiffinTalesLogo from "../assets/tiffintaleslogo.png";
import { useUser } from "../context/userContext.jsx";
import Loading from "../Loading.jsx";
import { storage } from "../utils/Storage.js";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function TopNav({ onLoginClick, onSignupClick, disableButtons }) {
  const { user, setUser, setToken } = useUser();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [redirectLoading, setRedirectLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cartItems?.length || 0;
  const userId = user?._id;

  // Scroll effect for nav shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch saved addresses
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/user/${userId}/address`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.addresses || [];
        setAddresses(data);
        if (data.length > 0) setSelectedAddress(data[0]);
      })
      .catch(() => {});
  }, [userId]);

  // Detect live location
  const handleDetectLocation = () => {
    if (!("geolocation" in navigator)) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          );
          setSelectedAddress({
            _id: "live",
            tag: "📍 Live",
            addressLine: res.data.display_name,
          });
        } catch {
          // geocoding failed — location stays unchanged
        } finally {
          setLocationLoading(false);
        }
      },
      () => setLocationLoading(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleLogout = () => {
    setLogoutLoading(true);
    storage.removeItem("userData");
    storage.removeItem("usertoken");
    setUser(null);
    setToken(null);
    setTimeout(() => (window.location.href = "/"), 600);
  };

  if (redirectLoading) return <Loading message="Redirecting..." />;
  if (logoutLoading) return <Loading message="Logging Out..." />;

  const navLinks = [
    { label: "Meals", path: "/meals" },
    { label: "Chefs", path: "/allchef" },
    { label: "Subscribe", path: user ? "/dashboard/subscription" : "/subscribe" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-white/95 backdrop-blur-md shadow-sm"
      } border-b border-orange-100`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={TiffinTalesLogo} alt="Tiffin Tales" className="h-10 w-auto" />
        </Link>

        {/* Address Bar — Desktop Only */}
        <div className="hidden lg:flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full max-w-xs cursor-pointer hover:border-orange-400 transition group">
          <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
          {user ? (
            <select
              value={selectedAddress?._id || ""}
              onChange={(e) => {
                const found = addresses.find((a) => a._id === e.target.value);
                if (found) setSelectedAddress(found);
              }}
              className="bg-transparent outline-none text-sm font-medium text-gray-700 truncate max-w-[180px] cursor-pointer"
            >
              {selectedAddress?._id === "live" && (
                <option value="live">{selectedAddress.addressLine?.slice(0, 35)}...</option>
              )}
              {addresses.map((addr) => (
                <option key={addr._id} value={addr._id}>
                  {addr.tag ? `${addr.tag} - ` : ""}{addr.street || addr.city || "Address"}
                </option>
              ))}
              {addresses.length === 0 && (
                <option value="">Add delivery address</option>
              )}
            </select>
          ) : (
            <span className="text-sm text-gray-500">Select location</span>
          )}
          {user && (
            <button
              onClick={handleDetectLocation}
              className="text-xs text-orange-500 hover:text-orange-600 font-semibold ml-1"
              title="Detect Location"
            >
              {locationLoading ? "..." : "📍"}
            </button>
          )}
        </div>

        {/* Nav Links — Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3">
          {/* Become a Chef */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/chef")}
            className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            👨‍🍳 Become a Chef
          </motion.button>

          {user ? (
            <>
              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/cart")}
                className="relative p-2 rounded-full bg-orange-50 hover:bg-orange-100 transition"
              >
                <FaShoppingCart className="text-orange-600 text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {cartCount}
                  </span>
                )}
              </motion.button>

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.img
                  whileHover={{ scale: 1.08 }}
                  src={user?.avtar || "https://cdn-icons-png.flaticon.com/512/11018/11018596.png"}
                  alt="Profile"
                  className="w-9 h-9 rounded-full cursor-pointer border-2 border-orange-400 object-cover shadow"
                  onClick={() => setProfileOpen(!profileOpen)}
                />
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 top-12 w-52 bg-white shadow-2xl rounded-2xl border border-orange-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
                        <p className="font-bold text-gray-800 text-sm truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {[
                        { label: "🏠 Dashboard", path: "/dashboard" },
                        { label: "📦 My Orders", path: "/orders" },
                        { label: "👤 Profile", path: "/profile" },
                        { label: "📋 Subscriptions", path: "/subscription" },
                      ].map((item) => (
                        <button
                          key={item.path}
                          onClick={() => { navigate(item.path); setProfileOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                      <div className="border-t border-orange-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold"
                      >
                        🚪 Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            !disableButtons && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onLoginClick || (() => navigate("/login"))}
                  className="text-sm font-semibold text-orange-600 px-4 py-2 rounded-full border border-orange-300 hover:bg-orange-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={onSignupClick || (() => navigate("/signup"))}
                  className="text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full shadow hover:shadow-md transition"
                >
                  Sign Up
                </button>
              </div>
            )
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-orange-50 transition"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-orange-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => { navigate(link.path); setMenuOpen(false); }}
                  className="block w-full text-left py-2.5 px-4 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium transition"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { navigate("/chef"); setMenuOpen(false); }}
                className="block w-full text-left py-2.5 px-4 rounded-xl text-orange-600 font-semibold hover:bg-orange-50 transition"
              >
                👨‍🍳 Become a Chef
              </button>
              {user ? (
                <>
                  <button onClick={() => { navigate("/cart"); setMenuOpen(false); }} className="block w-full text-left py-2.5 px-4 rounded-xl text-gray-700 hover:bg-orange-50 font-medium transition">
                    🛒 Cart ({cartCount})
                  </button>
                  <button onClick={() => { navigate("/orders"); setMenuOpen(false); }} className="block w-full text-left py-2.5 px-4 rounded-xl text-gray-700 hover:bg-orange-50 font-medium transition">
                    📦 My Orders
                  </button>
                  <button onClick={() => { navigate("/dashboard"); setMenuOpen(false); }} className="block w-full text-left py-2.5 px-4 rounded-xl text-gray-700 hover:bg-orange-50 font-medium transition">
                    🏠 Dashboard
                  </button>
                  <button onClick={handleLogout} className="block w-full text-left py-2.5 px-4 rounded-xl text-red-500 font-semibold hover:bg-red-50 transition">
                    🚪 Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <button onClick={onLoginClick || (() => navigate("/login"))} className="flex-1 py-2 text-center text-orange-600 border border-orange-300 rounded-xl font-semibold hover:bg-orange-50 transition text-sm">
                    Login
                  </button>
                  <button onClick={onSignupClick || (() => navigate("/signup"))} className="flex-1 py-2 text-center text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold transition text-sm">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default TopNav;
