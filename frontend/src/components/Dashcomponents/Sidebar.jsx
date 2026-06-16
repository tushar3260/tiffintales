import {
  HomeIcon,
  ShoppingBagIcon,
  CalendarIcon,
  WalletIcon,
  GiftIcon,
  CogIcon,
  LifebuoyIcon as SupportIcon,
  ClipboardDocumentListIcon as SubscriptionIcon,
  MapPinIcon as TrackerIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/userContext.jsx";
import TiffinTalesLogo from "../../assets/tiffintaleslogo.png";

const menu = [
  { label: "Dashboard",       path: "/dashboard",              icon: HomeIcon },
  { label: "My Orders",       path: "/dashboard/orders",       icon: ShoppingBagIcon },
  { label: "Order Tracker",   path: "/dashboard/tracker",      icon: TrackerIcon },
  { label: "Available Meals", path: "/dashboard/upcoming",     icon: CalendarIcon },
  { label: "My Subscription", path: "/dashboard/subscription", icon: SubscriptionIcon },
  { label: "Spending",        path: "/dashboard/wallet",       icon: WalletIcon },
  { label: "Analytics",       path: "/dashboard/charts",       icon: ChartBarIcon },
  { label: "Refer & Earn",    path: "/dashboard/refer",        icon: GiftIcon },
  { label: "Support",         path: "/dashboard/support",      icon: SupportIcon },
  { label: "Settings",        path: "/dashboard/settings",     icon: CogIcon },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useUser();

  return (
    <aside className="bg-white w-64 min-h-screen p-5 shadow-sm flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="mb-8 px-1">
        <img src={TiffinTalesLogo} alt="Tiffin Tales" className="h-9 w-auto" />
        <p className="text-xs text-gray-400 mt-1 font-medium">Your food dashboard</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-0.5">
        {menu.map(({ label, path, icon: Icon }) => {
          const isActive =
            path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(path);

          return (
            <Link
              key={label}
              to={path}
              className={`flex items-center w-full px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-orange-50 text-orange-600 border border-orange-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-orange-500"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 mr-3 flex-shrink-0 ${isActive ? "text-orange-500" : "text-gray-400"}`} />
              <span>{label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom profile link */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-orange-500 transition text-sm font-medium"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-xs truncate">{user?.fullName?.split(" ")[0] || "My Profile"}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email || ""}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
