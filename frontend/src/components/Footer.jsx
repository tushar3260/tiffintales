// Footer.jsx — Production Ready: navigate() instead of href, no Toaster, fixed routes
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaYoutube, FaTwitter, FaWhatsapp, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const cities = [
  "Mathura City", "Vrindavan", "Chaumhuna", "Govardhan", "Barsana",
  "GLA University", "Chhata", "Kosi Kalan", "Gokul", "Radhakund",
];

const footerLinks = {
  Explore: [
    { label: "Browse Meals",  path: "/meals" },
    { label: "Our Chefs",     path: "/allchef" },
    { label: "Subscriptions", path: "/subscribe" },
    { label: "My Dashboard",  path: "/dashboard" },
    { label: "My Orders",     path: "/dashboard/orders" },
  ],
  "For Chefs": [
    { label: "Become a Chef",  path: "/chef" },
    { label: "Chef Dashboard", path: "/chef/chefdashboard" },
    { label: "Chef Login",     path: "/chef/login" },
    { label: "Chef Signup",    path: "/chef/signup" },
  ],
  Company: [
    { label: "About Us", path: "/aboutus" },
    { label: "Our Team", path: "/team" },
    { label: "Blog",     path: "/blog" },
    { label: "Gallery",  path: "/gallery" },
  ],
  Support: [
    { label: "Help & Support", path: "/help" },
    { label: "Contact Us",     path: "/contact" },
    { label: "Terms",          path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Refund Policy",  path: "/refund" },
    { label: "Disclaimer",     path: "/disclaimer" },
  ],
};

const socials = [
  { icon: <FaInstagram />, url: "https://www.instagram.com/ts3231442",   label: "Instagram", color: "hover:bg-pink-500" },
  { icon: <FaYoutube />,   url: "https://youtube.com/@tiffintales-z3x",  label: "YouTube",   color: "hover:bg-red-500" },
  { icon: <FaTwitter />,   url: "#",                                       label: "Twitter",   color: "hover:bg-sky-500" },
  { icon: <FaWhatsapp />,  url: "https://wa.me/919109999999",             label: "WhatsApp",  color: "hover:bg-green-500" },
];

function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) return toast.error("Please enter a valid email");
    toast.success("Subscribed! Check your inbox for exclusive deals.");
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              {/* Logo */}
              <button
                onClick={() => navigate("/")}
                className="text-xl font-bold text-white tracking-tight mb-2 block hover:text-orange-400 transition-colors"
              >
                Tiffin Tales
              </button>
              <p className="text-gray-400 text-sm leading-relaxed mt-2">
                Real homemade food, delivered fresh. Supporting local home chefs
                across Mathura & beyond.
              </p>
            </div>

            {/* Socials */}
            <div className="mb-6">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Follow Us</p>
              <div className="flex items-center gap-2">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 ${s.color} hover:text-white transition-all duration-200`}
                    title={s.label}
                    aria-label={s.label}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Get Exclusive Offers</p>
              <div className="flex items-center bg-gray-800 rounded-xl overflow-hidden border border-gray-700 focus-within:border-orange-500 transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  aria-label="Newsletter email"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2.5 text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Link Columns — navigate() instead of href */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-xs text-gray-400 mb-4 uppercase tracking-widest">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-sm text-gray-500 hover:text-orange-400 transition-colors duration-150 text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Service Areas */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Available In</p>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <span
                key={city}
                className="text-xs px-3 py-1 bg-gray-800/60 text-gray-400 rounded-full hover:bg-orange-500/15 hover:text-orange-400 transition-colors cursor-default"
              >
                {city}
              </span>
            ))}
            <span className="text-xs px-3 py-1 bg-orange-500/15 text-orange-400 rounded-full font-semibold">
              + More coming soon
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © 2025 <span className="text-gray-300 font-semibold">Tiffin Tales</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {[["Privacy", "/privacy"], ["Terms", "/terms"], ["Refund", "/refund"], ["Contact", "/contact"]].map(([label, path]) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            Made with <FaHeart className="text-red-500 text-[10px]" /> for home food lovers
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
