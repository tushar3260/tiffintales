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

const menu = [
  { label: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { label: "My Orders", path: "/dashboard/orders", icon: ShoppingBagIcon },
  { label: "Order Tracker", path: "/dashboard/tracker", icon: TrackerIcon },
  { label: "Available Meals", path: "/dashboard/upcoming", icon: CalendarIcon },
  { label: "My Subscription", path: "/dashboard/subscription", icon: SubscriptionIcon },
  { label: "Spending", path: "/dashboard/wallet", icon: WalletIcon },
  { label: "Charts", path: "/dashboard/charts", icon: ChartBarIcon },
  { label: "Refer & Earn", path: "/dashboard/refer", icon: GiftIcon },
  { label: "Support", path: "/dashboard/support", icon: SupportIcon },
  { label: "Settings", path: "/dashboard/settings", icon: CogIcon },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useUser();

  return (
    <aside className="bg-[#1a1a2e] w-64 min-h-screen p-6 shadow-2xl flex flex-col border-r border-white/5">
      {/* Logo */}
      <div className="mb-8">
        <div className="text-2xl font-extrabold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          🍱 Tiffin Tales
        </div>
        <p className="text-xs text-gray-500 mt-1">Your food dashboard</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1">
        {menu.map(({ label, path, icon: Icon }) => {
          const isActive =
            path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(path);

          return (
            <Link
              key={label}
              to={path}
              className={`flex items-center w-full px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-orange-400"
              }`}
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom profile link */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-orange-400 transition text-sm font-medium"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          My Profile
        </Link>
      </div>
    </aside>
  );
}
