// TopNav.jsx — Premium Production Ready
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaBars, FaTimes, FaMapMarkerAlt, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { HiOutlineUser, HiOutlineViewGrid, HiOutlineShoppingBag, HiOutlineClipboardList } from "react-icons/hi";
import { RiRestaurantLine } from "react-icons/ri";
import axios from "axios";
import TiffinTalesLogo from "../assets/tiffintaleslogo.png";
import { useUser } from "../context/userContext.jsx";
import Loading from "../Loading.jsx";
import { storage } from "../utils/Storage.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useLocation2 } from "../context/LocationContext.jsx";

function TopNav({ onLoginClick, onSignupClick, disableButtons }) {
  const { user, setUser, setToken } = useUser();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { cartItems } = useCart();
  const userLocation = useLocation2();
  const [addresses, setAddresses]         = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [redirectLoading, setRedirectLoading] = useState(false);
  const [logoutLoading, setLogoutLoading]     = useState(false);
  const [profileOpen, setProfileOpen]         = useState(false);
  const [menuOpen, setMenuOpen]               = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [scrolled, setScrolled]               = useState(false);

  const cartCount = cartItems?.length || 0;
  const userId    = user?._id;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const handleDetectLocation = () => {
    if (!("geolocation" in navigator)) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          );
          setSelectedAddress({ _id: "live", tag: "Live Location", addressLine: res.data.display_name });
        } catch { /* geocoding failed */ }
        finally { setLocationLoading(false); }
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
    setTimeout(() => (window.location.href = "/"), 500);
  };

  if (redirectLoading) return <Loading message="Redirecting..." />;
  if (logoutLoading)   return <Loading message="Logging out..." />;

  const navLinks = [
    { label: "Meals",     path: "/meals" },
    { label: "Chefs",     path: "/allchef" },
    { label: "Subscribe", path: user ? "/dashboard/subscription" : "/subscribe" },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/98 shadow-[0_1px_20px_rgba(0,0,0,0.08)]"
          : "bg-white/90 backdrop-blur-xl"
      } border-b border-gray-100`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={TiffinTalesLogo} alt="Tiffin Tales" className="h-9 w-auto" />
        </Link>

        {/* Location Bar — Visible to ALL users (guest + logged-in) */}
        <div className="hidden lg:flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl max-w-[260px] cursor-pointer hover:border-orange-400 transition-colors group">
          <FaMapMarkerAlt className="text-orange-500 flex-shrink-0 text-sm" />
          {userLocation.loading ? (
            <span className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin inline-block" />
          ) : user && addresses.length > 0 ? (
            <select
              value={selectedAddress?._id || ""}
              onChange={(e) => {
                const found = addresses.find((a) => a._id === e.target.value);
                if (found) setSelectedAddress(found);
              }}
              className="bg-transparent outline-none text-xs font-medium text-gray-700 truncate max-w-[160px] cursor-pointer"
            >
              {selectedAddress?._id === "live" && (
                <option value="live">{selectedAddress.addressLine?.slice(0, 35)}...</option>
              )}
              {addresses.map((addr) => (
                <option key={addr._id} value={addr._id}>
                  {addr.tag ? `${addr.tag} — ` : ""}{addr.street || addr.city || "Address"}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs font-medium text-gray-700 truncate max-w-[160px]">
              {userLocation.error
                ? "Enable location"
                : userLocation.displayLabel || "Detecting..."}
            </span>
          )}
          <button
            onClick={userLocation.refresh}
            className="text-orange-500 hover:text-orange-600 ml-1 flex-shrink-0"
            title="Refresh location"
          >
            {userLocation.loading
              ? <span className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin inline-block" />
              : <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 8a4 4 0 100 8 4 4 0 000-8zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06z"/></svg>
            }
          </button>
        </div>

        {/* Nav Links — Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive(link.path)
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-600 hover:text-orange-600 hover:bg-gray-50"
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Become a Chef */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/chef")}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow hover:shadow-md transition-all"
          >
                        <RiRestaurantLine className="text-sm" />
            Become a Chef
          </motion.button>

          {user ? (
            <>
              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate("/cart")}
                className="relative p-2 rounded-xl bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-600 transition-colors"
                title="Cart"
              >
                <FaShoppingCart className="text-lg" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </motion.button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={user?.avtar || "https://cdn-icons-png.flaticon.com/512/11018/11018596.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-lg object-cover border-2 border-orange-200"
                  />
                  <span className="hidden sm:block text-sm font-semibold text-gray-700 max-w-[80px] truncate">
                    {user.fullName?.split(" ")[0]}
                  </span>
                  <FaChevronDown className={`text-gray-400 text-xs transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
                          <p className="font-bold text-gray-900 text-sm truncate">{user.fullName}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>

                        {/* Links */}
                        <div className="py-1">
                          {[
                            { label: "Dashboard",    path: "/dashboard",    icon: <HiOutlineViewGrid className="text-base" /> },
                            { label: "My Orders",    path: "/orders",       icon: <HiOutlineShoppingBag className="text-base" /> },
                            { label: "Profile",      path: "/profile",      icon: <HiOutlineUser className="text-base" /> },
                            { label: "Subscriptions",path: "/subscription", icon: <HiOutlineClipboardList className="text-base" /> },
                          ].map((item) => (
                            <button
                              key={item.path}
                              onClick={() => { navigate(item.path); setProfileOpen(false); }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 flex items-center gap-3 transition-colors"
                            >
                              <span className="text-gray-400">{item.icon}</span>
                              {item.label}
                            </button>
                          ))}
                        </div>

                        <div className="border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors font-semibold"
                          >
                            <FaSignOutAlt className="text-base" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            !disableButtons && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onLoginClick || (() => navigate("/login"))}
                  className="text-sm font-semibold text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Log in
                </button>
                <button
                  onClick={onSignupClick || (() => navigate("/signup"))}
                  className="text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 rounded-xl shadow hover:shadow-md hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Sign Up
                </button>
              </div>
            )
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
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
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => { navigate(link.path); setMenuOpen(false); }}
                  className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { navigate("/chef"); setMenuOpen(false); }}
                className="block w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-2"
              >
                <RiRestaurantLine /> Become a Chef
              </button>
              {user ? (
                <>
                  <button onClick={() => { navigate("/cart");       setMenuOpen(false); }} className="block w-full text-left py-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"><FaShoppingCart className="text-gray-400" /> Cart {cartCount > 0 && `(${cartCount})`}</button>
                  <button onClick={() => { navigate("/orders");     setMenuOpen(false); }} className="block w-full text-left py-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"><HiOutlineShoppingBag className="text-gray-400" /> My Orders</button>
                  <button onClick={() => { navigate("/dashboard");  setMenuOpen(false); }} className="block w-full text-left py-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"><HiOutlineViewGrid className="text-gray-400" /> Dashboard</button>
                  <button onClick={handleLogout} className="block w-full text-left py-2.5 px-3 rounded-lg text-sm text-red-500 font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"><FaSignOutAlt /> Sign Out</button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <button onClick={onLoginClick || (() => navigate("/login"))} className="flex-1 py-2.5 text-center text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Log in</button>
                  <button onClick={onSignupClick || (() => navigate("/signup"))} className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all">Sign Up</button>
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
