import { BellIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow rounded-t-2xl mb-6 sticky top-0 z-30">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        {/* Hamburger for Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 p-2 rounded-md hover:bg-gray-100 transition"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Address and Language Select (Hidden on small screens) */}
        <div className="hidden sm:flex items-center gap-3">
          <select className="rounded-lg px-3 py-2 bg-transparent border border-gray-200 focus:outline-none">
            <option>Home Address</option>
            <option>Work Address</option>
          </select>
          <select className="rounded-lg px-3 py-2 bg-transparent border border-gray-200 focus:outline-none">
            <option>EN</option>
            <option>HI</option>
          </select>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center">
        <button className="p-2 rounded-full hover:bg-orange-100 transition">
          <BellIcon className="w-6 h-6 text-gray-800" />
        </button>

        {/* Profile Section */}
        <div className="flex items-center ml-4">
          <img
            src="/path/profile.jpg"
            alt="Vartul"
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
          <span className="ml-2 font-semibold hidden sm:inline">Vartul</span>
        </div>
      </div>

      {/* Dropdown Menu for Mobile */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md border-t border-gray-100 md:hidden animate-slideDown">
          <div className="flex flex-col p-4 gap-3">
            <select className="rounded-lg px-3 py-2 bg-transparent border border-gray-200 focus:outline-none">
              <option>Home Address</option>
              <option>Work Address</option>
            </select>
            <select className="rounded-lg px-3 py-2 bg-transparent border border-gray-200 focus:outline-none">
              <option>EN</option>
              <option>HI</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
