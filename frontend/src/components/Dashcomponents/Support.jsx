// Support.jsx — Light Theme, Fully Functional
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeadset, FaEnvelope, FaPhone, FaChevronDown, FaChevronUp, FaPaperPlane } from "react-icons/fa";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import toast from "react-hot-toast";

const faqs = [
  { q: "How can I update my plan?", a: "Go to 'My Subscription' in Dashboard, then click on your active plan to manage it." },
  { q: "What if my meal is late?", a: "Contact our support team via the contact options above or use the Chat feature from your Order Tracker." },
  { q: "How do I track my order?", a: "Go to Dashboard > Order Tracker. It auto-refreshes every 15 seconds with live status." },
  { q: "Can I cancel my order?", a: "Orders can be cancelled within 15 minutes of placing. Go to My Orders and tap 'Cancel'." },
  { q: "How do I add a delivery address?", a: "Go to your Profile page and add or update your delivery address from there." },
];

const contactOptions = [
  { icon: <FaPhone className="text-2xl text-blue-500" />, title: "Call Us", desc: "+91 98765 43210", bg: "bg-blue-50", border: "border-blue-200" },
  { icon: <FaEnvelope className="text-2xl text-green-500" />, title: "Email Us", desc: "support@tiffintales.com", bg: "bg-green-50", border: "border-green-200" },
  { icon: <FaHeadset className="text-2xl text-purple-500" />, title: "Live Chat", desc: "Available 9am–9pm", bg: "bg-purple-50", border: "border-purple-200" },
];

export default function Support() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }
    setSubmitting(true);
    // Simulate form submission
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Message sent! We'll respond within 24 hours.");
    setForm({ name: "", email: "", message: "" });
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 sm:p-6 rounded-2xl shadow-md text-white">
        <h1 className="text-xl sm:text-2xl font-bold">Help & Support</h1>
        <p className="text-sm sm:text-base opacity-90 mt-1">We're here to help you 24/7</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {contactOptions.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`${item.bg} border ${item.border} p-5 rounded-2xl text-center space-y-2 cursor-pointer transition`}
          >
            <div className="flex justify-center">{item.icon}</div>
            <h2 className="text-base font-semibold text-gray-800">{item.title}</h2>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
          <HiOutlineQuestionMarkCircle className="text-blue-500 text-xl" /> Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqs.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 text-left text-sm transition"
              >
                {item.q}
                {faqOpen === i ? <FaChevronUp className="text-gray-400 text-xs flex-shrink-0 ml-2" /> : <FaChevronDown className="text-gray-400 text-xs flex-shrink-0 ml-2" />}
              </button>
              {faqOpen === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-4 py-3 text-gray-600 text-sm bg-gray-50 border-t border-gray-200 leading-relaxed"
                >
                  {item.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Send us a Message</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none text-sm transition"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none text-sm transition"
            />
          </div>
          <textarea
            rows="4"
            placeholder="Describe your issue..."
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none text-sm transition resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow hover:shadow-md transition flex items-center gap-2 disabled:opacity-60"
          >
            <FaPaperPlane /> {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
