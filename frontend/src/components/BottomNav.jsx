// BottomNav.jsx — Mobile-only bottom navigation bar (like Swiggy)
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiShoppingBag, FiUser } from "react-icons/fi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { FaUtensils } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";

const tabs = [
  { label: "Home",    path: "/",                  icon: FiHome },
  { label: "Meals",   path: "/meals",              icon: FaUtensils },
  { label: "Orders",  path: "/dashboard/orders",   icon: HiOutlineClipboardList },
  { label: "Profile", path: "/profile",            icon: FiUser },
];

export default function BottomNav() {
  const location = useLocation();
  const { cartItems } = useCart();
  const cartCount = cartItems?.length || 0;

  // Hide on dashboard (has sidebar), chef, admin routes
  const hide = ["/dashboard", "/chef", "/admin"].some(p => location.pathname.startsWith(p));
  if (hide) return null;

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {/* Cart quick-access (center elevated button) */}
        <Link
          to="/cart"
          className="relative -mt-5 flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-300">
            <FiShoppingBag className="text-white text-lg" />
          </div>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
          <span className="text-[9px] font-semibold text-orange-500 mt-1">Cart</span>
        </Link>

        {tabs.map(({ label, path, icon: Icon }, i) => {
          const active = isActive(path);
          // Insert cart button in the middle (after index 1)
          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center gap-0.5 min-w-[56px] py-1 px-2 group"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                active ? "bg-orange-50" : "group-hover:bg-gray-50"
              }`}>
                <Icon className={`text-base transition-colors ${
                  active ? "text-orange-500" : "text-gray-400 group-hover:text-gray-600"
                }`} />
              </div>
              <span className={`text-[9px] font-semibold transition-colors ${
                active ? "text-orange-500" : "text-gray-400"
              }`}>
                {label}
              </span>
              {active && (
                <span className="w-1 h-1 bg-orange-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
