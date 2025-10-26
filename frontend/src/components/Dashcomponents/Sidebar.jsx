import {
  HomeIcon,
  ShoppingBagIcon,
  CalendarIcon,
  WalletIcon,
  GiftIcon,
  CogIcon,
  LifebuoyIcon as SupportIcon,
  ClipboardDocumentListIcon as SubscriptionIcon, // New icon
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { label: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { label: "My Orders", path: "/dashboard/orders", icon: ShoppingBagIcon },
  { label: "Upcoming Meals", path: "/dashboard/upcoming", icon: CalendarIcon },
  { label: "My Subscription", path: "/dashboard/subscription", icon: SubscriptionIcon }, // NEW
  { label: "Wallet", path: "/dashboard/wallet", icon: WalletIcon },
  { label: "Refer & Earn", path: "/dashboard/refer", icon: GiftIcon },
  { label: "Support", path: "/dashboard/support", icon: SupportIcon },
  { label: "Settings", path: "/dashboard/settings", icon: CogIcon },
  { label: "Chat with Chef", path: "/dashboard/chat/:orderId", icon: HomeIcon }, // Reusing HomeIcon for Chat with Chef
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="bg-white w-64 min-h-screen p-6 shadow-xl flex flex-col">
      {/* Logo */}
      <div className="text-2xl font-bold text-orange-500 mb-10">
        Tiffin Tales
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2">
        {menu.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-orange-500 hover:text-white"
              }`}
            >
              <Icon className="w-6 h-6 mr-3" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
