import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaEnvelope, FaWhatsapp, FaPhoneAlt, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TopNav from "../components/TopNav";

const faqs = [
  // Ordering
  {
    category: "Ordering",
    question: "How do I place an order?",
    answer:
      "Visit the All Meals page, choose your preferred meal and chef, add to cart, and follow the checkout steps. You can pay via UPI, card, or other supported payment methods through Razorpay. The whole process takes under 2 minutes!",
  },
  {
    category: "Ordering",
    question: "Can I schedule my tiffin for a specific time?",
    answer:
      "Yes! When placing your order, you can specify your preferred delivery slot — typically Lunch (12:00–1:30 PM) or Dinner (7:00–8:30 PM). If you need a custom time, mention it in the order notes and the chef will try to accommodate.",
  },
  {
    category: "Ordering",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major payment methods via Razorpay: UPI (Google Pay, PhonePe, Paytm), debit/credit cards (Visa, Mastercard, RuPay), net banking, and wallet payments. Cash on delivery is available for select areas.",
  },
  {
    category: "Ordering",
    question: "Is there a minimum order value?",
    answer:
      "For single orders, there is no minimum order value. However, for the best value, we recommend our subscription plans which offer per-meal prices as low as ₹21/meal.",
  },
  // Delivery
  {
    category: "Delivery",
    question: "Which areas do you serve?",
    answer:
      "We currently serve Mathura City, Vrindavan, Chaumhuna, GLA University area, Govardhan, Barsana, Chhata, Kosi Kalan, Gokul, and Radhakund. We are expanding to new areas regularly — check the website for the latest coverage.",
  },
  {
    category: "Delivery",
    question: "How long does delivery take?",
    answer:
      "Delivery typically takes 20–45 minutes from the time your chef completes preparation. For subscription orders, meals are delivered within a 1-hour delivery window that you choose at the time of subscription.",
  },
  {
    category: "Delivery",
    question: "What if my food is late or missing?",
    answer:
      "Contact us immediately on WhatsApp (+91-9109999999) or email support@tiffintalesindia.me. If your food is delayed by more than 30 minutes beyond the promised time, you are eligible for a partial refund or credit. We resolve all delivery complaints within 2 hours.",
  },
  {
    category: "Delivery",
    question: "Do you deliver on weekends and public holidays?",
    answer:
      "Most of our chefs deliver 7 days a week. However, availability may be limited on major public holidays. We will notify you at least 24 hours in advance if your usual chef is unavailable on a particular day.",
  },
  // Subscriptions
  {
    category: "Subscriptions",
    question: "What subscription plans do you offer?",
    answer:
      "We offer flexible plans: Lunch-only (₹650/month), Dinner-only (₹700/month), and our most popular 2-meal plan (Lunch + Dinner) at ₹1,299/month. All plans cover 30 days of service with verified home chefs.",
  },
  {
    category: "Subscriptions",
    question: "Can I pause or cancel my subscription?",
    answer:
      "Yes! You can pause your subscription for up to 7 days per month (e.g., if you're traveling) from your Dashboard → Subscription → Pause Delivery. Cancellations can be done anytime — no hidden fees or exit charges. Refunds for remaining days are processed within 5–7 working days.",
  },
  {
    category: "Subscriptions",
    question: "Can I change my chef mid-subscription?",
    answer:
      "Yes. If you're unsatisfied with your current chef, contact our support team and we will arrange a replacement within 24–48 hours, at no extra cost.",
  },
  // Food Quality
  {
    category: "Food Quality",
    question: "How do you verify home chefs?",
    answer:
      "Every chef on Tiffin Tales goes through a 3-step verification: (1) Identity verification, (2) Kitchen hygiene inspection by our team, and (3) A sample meal tasting. Only chefs who pass all three steps are allowed on the platform. We also conduct periodic re-inspections.",
  },
  {
    category: "Food Quality",
    question: "Can I customize my tiffin?",
    answer:
      "Yes! You can mention preferences in your order notes — less spice, no onion/garlic (Jain), extra roti, or specific sabzi preferences. Chefs may accommodate dietary requirements based on their menu, so communicate clearly at the time of ordering.",
  },
  {
    category: "Food Quality",
    question: "Is the food 100% vegetarian?",
    answer:
      "Yes, all meals on Tiffin Tales are strictly vegetarian. We do not allow non-vegetarian food on our platform. For Jain customers (no onion/garlic), please filter by 'Jain-friendly' or mention your requirement in order notes.",
  },
  // Accounts & Technical
  {
    category: "Account & Technical",
    question: "How do I track my order?",
    answer:
      "Once your order is placed, go to Dashboard → My Orders → Track. You will see real-time status updates from the chef. You will also receive notifications on your registered mobile number.",
  },
  {
    category: "Account & Technical",
    question: "I forgot my password. How do I reset it?",
    answer:
      "Click 'Forgot Password' on the login page and enter your registered email. You'll receive a password reset link within 2–3 minutes. Check your spam folder if you don't see it in your inbox.",
  },
];

const categories = ["All", ...new Set(faqs.map((f) => f.category))];

function HelpSupport() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const toggle = (index) => setOpenIndex(index === openIndex ? null : index);

  const filtered = faqs.filter(
    (f) => activeCategory === "All" || f.category === activeCategory
  );

  return (
    <>
      <TopNav />
      <div className="bg-white text-zinc-800 min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100 py-14 px-6 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full uppercase tracking-widest mb-4">
            Support
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-3">Help & Support</h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Find answers to the most common questions below. Can't find what you need? Reach out directly — we reply fast.
          </p>

          {/* Quick contact */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a
              href="mailto:support@tiffintalesindia.me"
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition"
            >
              <FaEnvelope /> Email Support
            </a>
            <a
              href="https://wa.me/919109999999?text=Hello%20Tiffin%20Tales%2C%20I%20need%20help."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <a
              href="tel:+919109999999"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-full text-sm font-semibold hover:bg-zinc-900 transition"
            >
              <FaPhoneAlt /> Call Us
            </a>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-14">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-orange-300 hover:text-orange-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQs List */}
          <div className="space-y-3">
            {filtered.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`border rounded-2xl overflow-hidden transition-colors ${
                  openIndex === idx
                    ? "border-orange-200 bg-orange-50"
                    : "border-zinc-100 bg-white hover:border-orange-100"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex justify-between items-center w-full text-left px-5 py-4 group"
                  aria-expanded={openIndex === idx}
                >
                  <div className="flex items-center gap-3 flex-1 pr-4">
                    <span className="text-xs font-bold px-2.5 py-1 bg-orange-100 text-orange-600 rounded-full whitespace-nowrap">
                      {faq.category}
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 group-hover:text-orange-600 transition leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <FaChevronDown className={openIndex === idx ? "text-orange-500" : "text-zinc-400"} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === idx && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-zinc-600 leading-relaxed border-t border-orange-100 pt-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Still need help */}
          <div className="mt-16 bg-gradient-to-br from-orange-500 to-red-500 p-8 rounded-3xl text-white text-center">
            <h3 className="text-2xl font-black mb-2">Still need help?</h3>
            <p className="text-white/80 mb-6">
              Our support team is available Monday–Saturday, 9 AM to 7 PM. We typically reply within 2 hours on WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:support@tiffintalesindia.me"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition text-sm"
              >
                <FaEnvelope /> Email Us
              </a>
              <a
                href="https://wa.me/919109999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition text-sm"
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <button
                onClick={() => navigate("/contact")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition text-sm"
              >
                <FaEdit /> Contact Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HelpSupport;
