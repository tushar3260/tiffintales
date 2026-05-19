// Footer — Production Ready
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaYoutube, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const cities = [
  "Mathura City", "Vrindavan", "Chaumhuna", "Govardhan", "Barsana",
  "GLA University", "Chhata", "Kosi Kalan", "Gokul", "Radhakund",
];

const footerLinks = {
  Explore: [
    { label: "Browse Meals", path: "/meals" },
    { label: "Our Chefs", path: "/allchef" },
    { label: "Subscriptions", path: "/subscription" },
    { label: "My Dashboard", path: "/dashboard" },
    { label: "My Orders", path: "/orders" },
  ],
  "For Chefs": [
    { label: "Become a Chef", path: "/chef" },
    { label: "Chef Dashboard", path: "/chef/chefdashboard" },
    { label: "Chef Login", path: "/chef/login" },
    { label: "Chef Signup", path: "/chef/signup" },
  ],
  Company: [
    { label: "About Us", path: "/aboutus" },
    { label: "Our Team", path: "/team" },
    { label: "Blog", path: "/gallery" },
    { label: "Careers", path: "/careers" },
  ],
  Support: [
    { label: "Help & Support", path: "/help" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Refund Policy", path: "/refund" },
  ],
};

const socials = [
  { icon: <FaInstagram />, url: "https://www.instagram.com/ts3231442", color: "hover:text-pink-500", label: "Instagram" },
  { icon: <FaYoutube />, url: "https://youtube.com/@tiffintales-z3x", color: "hover:text-red-500", label: "YouTube" },
  { icon: <FaTwitter />, url: "#", color: "hover:text-blue-400", label: "Twitter" },
  { icon: <FaWhatsapp />, url: "https://wa.me/9109999999", color: "hover:text-green-400", label: "WhatsApp" },
];

function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) return toast.error("Enter a valid email");
    toast.success(`🎉 You're subscribed! Watch your inbox.`);
    setEmail("");
  };

  return (
    <>
      <Toaster position="top-right" />
      <footer className="bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-950 text-white">
        
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h2 className="text-2xl font-extrabold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  🍱 Tiffin Tales
                </h2>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                  Real homemade food, delivered fresh. Supporting local home chefs
                  across Mathura & beyond.
                </p>
              </div>
              
              {/* Socials */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Follow Us</p>
                <div className="flex items-center gap-3">
                  {socials.map((s) => (
                    <motion.a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.2, y: -2 }}
                      className={`w-9 h-9 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 ${s.color} transition-colors`}
                      title={s.label}
                    >
                      {s.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Get Exclusive Offers
                </p>
                <div className="flex items-center bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 focus-within:border-orange-500 transition">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email..."
                    className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  />
                  <button
                    onClick={handleSubscribe}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2.5 text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="font-bold text-sm text-white mb-4 uppercase tracking-wide">
                  {section}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="text-zinc-400 hover:text-orange-400 text-sm transition-colors text-left"
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
        <div className="border-t border-zinc-800 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Available In
            </p>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <span
                  key={city}
                  className="text-xs px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full hover:bg-orange-500/20 hover:text-orange-400 transition cursor-default"
                >
                  {city}
                </span>
              ))}
              <span className="text-xs px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full font-semibold">
                + More coming soon
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">
              © 2025 <span className="text-white font-semibold">Tiffin Tales</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {["Privacy", "Terms", "Refund"].map((t) => (
                <button
                  key={t}
                  onClick={() => navigate(`/${t.toLowerCase()}`)}
                  className="text-xs text-zinc-500 hover:text-orange-400 transition"
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-600">
              Made with ❤️ for real home food lovers
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
