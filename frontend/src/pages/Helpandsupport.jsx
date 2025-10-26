import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import TopNav from "../components/TopNav";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Visit the All Meals page, choose your meal, and follow the checkout steps. It’s quick and simple!",
  },
  {
    question: "Which areas do you serve?",
    answer:
      "We serve regions in Mathura including GLA University, Vrindavan, Chaumhuna, and more.",
  },
  {
    question: "Can I customize my tiffin?",
    answer:
      "Yes! You can mention preferences while ordering. We offer basic customization.",
  },
  {
    question: "What if my food is late or missing?",
    answer:
      "Contact our support team via email or call. We’ll resolve it quickly and fairly.",
  },
];

function HelpSupport() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <>
    <TopNav />
    <div className="bg-white text-zinc-800 px-6 py-16 sm:px-12 md:px-24 lg:px-40 min-h-screen">
      

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-orange-500 text-center">
          Help & Support
        </h1>

        {/* FAQs Header */}
        <h2 className="text-2xl font-bold text-zinc-900 mb-8 text-center">FAQs</h2>

        {/* FAQs List */}
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border-b border-zinc-300 pb-4 transition-all duration-300"
            >
              <button
                onClick={() => toggle(idx)}
                className="flex justify-between items-center w-full text-left group"
              >
                <span className="text-lg font-semibold text-zinc-900 group-hover:text-orange-500 transition">
                  {faq.question}
                </span>
                {openIndex === idx ? (
                  <FaChevronDown className="text-orange-500" />
                ) : (
                  <FaChevronRight className="text-orange-500" />
                )}
              </button>
              {openIndex === idx && (
                <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-orange-50 p-6 rounded-xl shadow text-center">
          <h3 className="text-2xl font-bold text-orange-500 mb-2">
            Still need help?
          </h3>
          <p className="text-zinc-700 mb-4">
            Reach out to our support team — we’re happy to help!
          </p>
          <a
            href="mailto:support@tiffintales.com"
            className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
          >
            Email Support
          </a>
        </div>
      </div>
    </div>
    </>
  );
}

export default HelpSupport;
