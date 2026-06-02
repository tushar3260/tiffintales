import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaClock } from "react-icons/fa";

const ContactUs = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Using Formspree (free tier) — replace YOUR_FORM_ID with actual ID from formspree.io
    try {
      await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      // Fallback: open mailto
      window.location.href = `mailto:support@tiffintalesindia.me?subject=${encodeURIComponent(form.subject || "Contact from website")}&body=${encodeURIComponent(form.message)}`;
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-orange-500 text-xl" />,
      label: "Email Us",
      value: "support@tiffintalesindia.me",
      sub: "We reply within 24 hours",
      href: "mailto:support@tiffintalesindia.me",
    },
    {
      icon: <FaPhoneAlt className="text-orange-500 text-xl" />,
      label: "Call Us",
      value: "+91-9109999999",
      sub: "Mon–Sat, 9 AM – 7 PM",
      href: "tel:+919109999999",
    },
    {
      icon: <FaWhatsapp className="text-orange-500 text-xl" />,
      label: "WhatsApp",
      value: "+91-9109999999",
      sub: "Quick replies on WhatsApp",
      href: "https://wa.me/919109999999?text=Hello%20Tiffin%20Tales%2C%20I%20have%20a%20question.",
    },
    {
      icon: <FaMapMarkerAlt className="text-orange-500 text-xl" />,
      label: "Our Location",
      value: "Mathura, Uttar Pradesh",
      sub: "India — 281001",
      href: "https://maps.google.com/?q=Mathura,Uttar+Pradesh",
    },
  ];

  const faqs = [
    { q: "How do I track my order?", a: "Once your order is placed, you can track it live from your Dashboard → My Orders → Track." },
    { q: "What if my delivery is late?", a: "Contact us on WhatsApp (+91-9109999999) and our team will resolve it within 30 minutes." },
    { q: "Can I cancel my subscription?", a: "Yes, you can cancel anytime from Dashboard → Subscription → Cancel. Refunds are processed in 5-7 days." },
    { q: "How do I become a home chef?", a: "Click 'Become a Chef' in the top navigation. Our team will verify your profile within 48 hours." },
  ];

  return (
    <>
      <TopNav />
      <div className="bg-white min-h-screen text-zinc-800 light-page">
        {/* Hero */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100 py-14 px-6 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full uppercase tracking-widest mb-4">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-3">Contact Us</h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Have a question, complaint, or feedback? We're here to help. Reach out and we'll get back to you ASAP.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* LEFT — Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Talk to Us Directly</h2>
                <p className="text-zinc-500">Choose any channel below. Our team typically responds within a few hours.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="flex flex-col gap-2 p-5 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-100 hover:border-orange-300 transition group"
                  >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition">
                      {item.icon}
                    </div>
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">{item.label}</p>
                    <p className="font-semibold text-zinc-800 text-sm">{item.value}</p>
                    <p className="text-xs text-zinc-400">{item.sub}</p>
                  </a>
                ))}
              </div>

              {/* Business Hours */}
              <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                <div className="flex items-center gap-2 mb-4">
                  <FaClock className="text-orange-500" />
                  <h3 className="font-bold text-zinc-800">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-zinc-600">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-semibold text-zinc-800">9:00 AM – 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold text-zinc-800">10:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold text-zinc-800">Emergency support only</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-600 font-semibold">WhatsApp support is available 7 days a week</span>
                </div>
              </div>

              {/* Follow us */}
              <div>
                <h3 className="font-bold text-zinc-800 mb-3">Follow Us</h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/ts3231442"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-sm font-semibold hover:bg-pink-100 transition"
                  >
                    <FaInstagram /> Instagram
                  </a>
                  <a
                    href="https://wa.me/919109999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-semibold hover:bg-green-100 transition"
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT — Contact Form */}
            <div>
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center bg-green-50 rounded-3xl border border-green-100">
                  <span className="text-6xl mb-4">✅</span>
                  <h3 className="text-2xl font-bold text-green-700 mb-2">Message Sent!</h3>
                  <p className="text-green-600 mb-6">We've received your message and will reply within 24 hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 transition"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 bg-orange-50 p-8 rounded-3xl border border-orange-100">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-1">Send Us a Message</h2>
                    <p className="text-zinc-400 text-sm">We read every message and reply personally.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Rahul Kumar"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-800 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="rahul@gmail.com"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-800 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-700 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                    >
                      <option value="">Select a topic…</option>
                      <option value="Order Issue">Order Issue</option>
                      <option value="Refund Request">Refund Request</option>
                      <option value="Chef Registration">Chef Registration</option>
                      <option value="Subscription Help">Subscription Help</option>
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Feedback">Feedback / Suggestion</option>
                      <option value="Partnership">Partnership / Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Describe your issue or question in detail…"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-800 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition text-base disabled:opacity-50"
                  >
                    {loading ? "Sending…" : "Send Message →"}
                  </button>

                  <p className="text-xs text-zinc-400 text-center">
                    By submitting, you agree to our{" "}
                    <button type="button" onClick={() => navigate("/privacy")} className="text-orange-500 hover:underline">
                      Privacy Policy
                    </button>.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Quick FAQ */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
                  <p className="font-semibold text-zinc-800 mb-2">❓ {faq.q}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-6 text-zinc-400 text-sm">
              More questions?{" "}
              <button onClick={() => navigate("/help")} className="text-orange-500 hover:underline font-semibold">
                Visit our full Help Center →
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
