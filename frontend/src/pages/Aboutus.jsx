import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

const stats = [
  { value: "1,000+", label: "Happy Customers", icon: "😊" },
  { value: "50+",    label: "Verified Home Chefs", icon: "👨‍🍳" },
  { value: "10+",    label: "Delivery Areas", icon: "📍" },
  { value: "4.8⭐",  label: "Average Rating", icon: "🌟" },
];

const values = [
  {
    title: "Authenticity First",
    icon: "🏠",
    desc: "Every meal on Tiffin Tales is made by a verified home cook in a real kitchen — not a restaurant, not a ghost kitchen, not a factory. We exist to preserve the taste of home-cooked food.",
  },
  {
    title: "Empower Local Chefs",
    icon: "💪",
    desc: "We believe that skilled home cooks — especially women who have spent years perfecting traditional recipes — deserve a sustainable income from their craft. Tiffin Tales gives them that platform.",
  },
  {
    title: "Transparency Always",
    icon: "🔍",
    desc: "We verify every chef, inspect every kitchen, and share that information with our customers. You will always know who made your food, where they cooked it, and when it was prepared.",
  },
  {
    title: "Community Over Commerce",
    icon: "🤝",
    desc: "We are building a community — not just a business. Every subscription supports a local family, contributes to the local economy, and helps preserve Mathura's rich culinary heritage.",
  },
];

const milestones = [
  { date: "Jan 2025", event: "Tiffin Tales founded in Mathura by 4 GLA University students with a mission to solve the daily food problem for students and working professionals." },
  { date: "Feb 2025", event: "Onboarded our first 10 verified home chefs from Vrindavan and Chaumhuna. Served our first 50 customers." },
  { date: "Mar 2025", event: "Launched subscription plans. 200 active subscribers in the first month." },
  { date: "May 2025", event: "Expanded to GLA University area, Barsana, Govardhan, and Chhata. Reached 500+ orders delivered." },
  { date: "Jul 2025", event: "Crossed 1,000 happy customers. 50+ verified chefs on the platform. Expanded blog & community content." },
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <>
      <TopNav />
      <div className="bg-white text-zinc-800 light-page">

        {/* Hero */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100 py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full uppercase tracking-widest mb-4">
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-5 leading-tight">
              About Tiffin Tales
            </h1>
            <p className="text-zinc-600 text-lg leading-relaxed max-w-2xl mx-auto">
              We're a small team of food-lovers and technologists from Mathura, on a mission to connect you with the best home-cooked meals from verified local chefs — freshly made, honestly priced, and delivered with care.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-zinc-100 py-10 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i} className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-3xl mb-1">{s.icon}</div>
                <p className="text-2xl font-black text-zinc-900">{s.value}</p>
                <p className="text-xs text-zinc-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 mb-5">How Tiffin Tales Began</h2>
              <div className="space-y-4 text-zinc-600 leading-relaxed">
                <p>
                  It started with a simple, frustrating problem that every GLA University student in Mathura knows too well: the hostel mess food was monotonous, restaurants were expensive, and Zomato deliveries were draining bank accounts faster than textbooks.
                </p>
                <p>
                  In January 2025, four friends — Tushar Bansal, Tushar Arya, Tushar Singh, and Vartul Arora — decided to build a solution. The idea was simple: <strong className="text-zinc-800">connect students and working professionals in Mathura with verified home chefs who could provide fresh, affordable, home-cooked meals daily.</strong>
                </p>
                <p>
                  What they didn't expect was how many talented home cooks existed in Mathura and Vrindavan — aunties who had spent decades perfecting dal tadka, retired school cooks who knew how to feed 50 people efficiently, young mothers who cooked for love and were now cooking for livelihoods.
                </p>
                <p>
                  Tiffin Tales wasn't just solving a food problem. It was giving local talent a platform, preserving traditional Braj recipes, and building a community around the most universal human experience: sharing a meal.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl p-8 text-center">
              <span className="text-7xl block mb-4">🍱</span>
              <blockquote className="text-xl font-semibold text-zinc-800 italic leading-relaxed">
                "We don't just deliver food. We deliver the taste of home — made with the same care your mother puts into every meal."
              </blockquote>
              <p className="mt-4 text-sm text-zinc-500 font-medium">— Tushar Bansal, Founder</p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-zinc-900 text-white py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              To make fresh, home-cooked, nutritious meals accessible to everyone in Mathura and beyond — while creating sustainable livelihoods for local home chefs and preserving the rich culinary heritage of Braj.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {values.map((v, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left hover:bg-white/10 transition">
                  <span className="text-3xl block mb-3">{v.icon}</span>
                  <h3 className="font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-zinc-900 mb-3 text-center">Why Choose Tiffin Tales?</h2>
          <p className="text-zinc-500 text-center mb-10 max-w-xl mx-auto">
            There are several tiffin options in Mathura. Here's what genuinely sets us apart.
          </p>
          <div className="space-y-4">
            {[
              { title: "Verified Home Chefs — Not Restaurants", desc: "Every chef on our platform is personally verified by our team. We inspect their kitchen, taste their food, and check their hygiene standards before they serve a single customer.", icon: "✅" },
              { title: "Fresh Ingredients, Cooked Daily", desc: "Our chefs shop from local mandis every morning. Your tiffin is made fresh the same day it's delivered — no reheated, day-old food.", icon: "🌿" },
              { title: "Transparent Pricing — No Surprises", desc: "What you see is what you pay. No surge pricing, no hidden delivery fees, no sudden price hikes. Our subscription prices are fixed for the duration of your plan.", icon: "💰" },
              { title: "Real-Time Order Tracking", desc: "Follow your tiffin from the chef's kitchen to your door through our live order tracking feature in the Tiffin Tales app.", icon: "📍" },
              { title: "Flexible Subscriptions", desc: "Pause anytime, cancel anytime. No lock-ins, no exit penalties. We believe you stay because the food is great — not because you're trapped in a contract.", icon: "🔄" },
              { title: "Support Local Economy", desc: "When you subscribe to Tiffin Tales, you're directly supporting a local family in Mathura. 90% of your payment goes to the home chef. That's community commerce in action.", icon: "🤲" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-orange-50 rounded-2xl border border-orange-100">
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-zinc-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="bg-orange-50 border-t border-b border-orange-100 py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-zinc-900 mb-10 text-center">Our Journey So Far</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-orange-200" />
              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <div key={i} className="flex gap-6 pl-10 relative">
                    <div className="absolute left-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 border-4 border-orange-50">
                      {i + 1}
                    </div>
                    <div>
                      <span className="inline-block text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full mb-2">
                        {m.date}
                      </span>
                      <p className="text-zinc-700 leading-relaxed text-sm">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-zinc-900 mb-3 text-center">Where We Deliver</h2>
          <p className="text-zinc-500 text-center mb-8">Currently serving these areas in Mathura district, with more coming soon.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Mathura City", "Vrindavan", "Chaumhuna", "GLA University Area", "Govardhan", "Barsana", "Chhata", "Kosi Kalan", "Gokul", "Radhakund"].map((area) => (
              <span
                key={area}
                className="px-4 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-sm font-semibold"
              >
                📍 {area}
              </span>
            ))}
            <span className="px-4 py-2 bg-zinc-100 text-zinc-500 border border-zinc-200 rounded-full text-sm font-medium">
              + More areas coming in 2026
            </span>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 py-14 px-6 text-center text-white">
          <h2 className="text-3xl font-black mb-3">Ready to Taste the Difference?</h2>
          <p className="text-white/80 text-lg mb-6 max-w-xl mx-auto">
            Join 1,000+ happy customers across Mathura and Vrindavan who eat home-cooked meals every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/meals")}
              className="px-8 py-3.5 bg-white text-orange-600 font-black rounded-2xl hover:bg-orange-50 transition shadow-lg"
            >
              Browse Meals →
            </button>
            <button
              onClick={() => navigate("/subscribe")}
              className="px-8 py-3.5 bg-white/20 text-white font-bold rounded-2xl border border-white/30 hover:bg-white/30 transition"
            >
              View Subscription Plans
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
