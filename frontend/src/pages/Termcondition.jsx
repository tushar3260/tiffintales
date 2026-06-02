import React from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <>
      <TopNav />
      <div className="bg-white text-zinc-800 min-h-screen light-page">

        {/* Hero */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100 py-14 px-6 pt-24">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full uppercase tracking-widest mb-4">
              Legal
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-3">
              Terms &amp; Conditions
            </h1>
            <p className="text-zinc-500 text-base">
              Last updated: <strong>July 22, 2025</strong> &nbsp;|&nbsp; Effective date: <strong>January 1, 2025</strong>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-14 space-y-10 text-base leading-relaxed text-zinc-700">

          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-xl p-5">
            <p>
              Welcome to <strong className="text-orange-600">Tiffin Tales</strong>. By accessing or using our website{" "}
              <a href="https://tiffintalesindia.me" className="text-orange-600 hover:underline">tiffintalesindia.me</a>
              {" "}or our food delivery platform, you agree to be bound by these Terms &amp; Conditions. Please read them carefully before using our services. If you do not agree, please do not use our platform.
            </p>
          </div>

          {/* 1 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">1</span>
              Eligibility &amp; Account Registration
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>You must be at least <strong>13 years of age</strong> to use Tiffin Tales. Users under 18 must have parental or guardian consent.</li>
              <li>You must provide accurate, current, and complete information during registration.</li>
              <li>You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
              <li>Tiffin Tales reserves the right to suspend or terminate any account found to contain false or misleading information.</li>
              <li>One person may not create multiple accounts. Duplicate accounts may be suspended without notice.</li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">2</span>
              Use of the Platform
            </h2>
            <p className="mb-3">You agree to use Tiffin Tales only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the platform. Prohibited uses include but are not limited to:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>Posting false, defamatory, or misleading reviews or content.</li>
              <li>Attempting to gain unauthorized access to other users' accounts or our systems.</li>
              <li>Using automated bots, scrapers, or tools to access or extract content from the platform.</li>
              <li>Conducting any fraudulent, abusive, or illegal activity through the platform.</li>
              <li>Impersonating another user, chef, or Tiffin Tales employee.</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">3</span>
              Orders &amp; Delivery
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>All orders are subject to availability of the selected chef and their menu items.</li>
              <li>Delivery times are estimated and may vary due to traffic, weather, or operational constraints. We strive to minimize delays but cannot guarantee exact delivery windows.</li>
              <li>You are responsible for providing an accurate and accessible delivery address. Failed deliveries due to incorrect address information are not eligible for a refund.</li>
              <li>Tiffin Tales acts as a marketplace connecting customers with home chefs. The chef is the food service provider; we are the platform facilitating the connection.</li>
              <li>We reserve the right to cancel orders in cases of suspected fraud, technical errors, or unavailability.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">4</span>
              Pricing &amp; Payments
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>All prices listed on the platform are in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.</li>
              <li>Prices are subject to change at any time without prior notice. The price shown at the time of order confirmation is the final price.</li>
              <li>Payment must be completed before delivery, except for orders placed on the Cash on Delivery (COD) option where available.</li>
              <li>We use <strong>Razorpay</strong> as our payment gateway. We do not store any card or UPI details on our servers. All payment data is processed securely by Razorpay under their own privacy and security policies.</li>
              <li>In case of a payment failure, your order will not be confirmed. Please retry or contact support.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">5</span>
              Cancellations &amp; Refunds
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>Orders can be canceled <strong>at least 30 minutes before the scheduled delivery time</strong>. Cancellations after preparation has begun are not eligible for refunds.</li>
              <li>Refunds are processed within <strong>5–7 working days</strong> to the original payment method for eligible cancellations.</li>
              <li>If you receive an incorrect, incomplete, or spoiled order due to an error on our end, please contact support within 2 hours of delivery. We will investigate and provide a replacement or refund at our discretion.</li>
              <li>Subscription plans have their own cancellation terms outlined in the subscription agreement at the time of purchase.</li>
              <li>For complete details, please review our <button onClick={() => navigate("/refund")} className="text-orange-500 hover:underline font-medium">Refund &amp; Cancellation Policy</button>.</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">6</span>
              Chef Terms &amp; Responsibilities
            </h2>
            <p className="mb-3">If you register as a home chef on Tiffin Tales, you additionally agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>Maintain accurate and up-to-date menu information, including pricing, availability, and allergen information.</li>
              <li>Prepare food in a clean, hygienic kitchen using fresh ingredients and in compliance with applicable food safety standards.</li>
              <li>Complete deliveries within the committed time windows, or promptly notify customers of any delays.</li>
              <li>Not misrepresent yourself, your qualifications, or your kitchen conditions during the registration process.</li>
              <li>Tiffin Tales reserves the right to suspend or remove chefs from the platform for violations of these terms, negative reviews, or safety concerns.</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">7</span>
              Intellectual Property
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>All content on the Tiffin Tales platform — including logos, text, graphics, and software — is the intellectual property of Tiffin Tales or its licensors and is protected under applicable Indian copyright law.</li>
              <li>You may not reproduce, distribute, or create derivative works from our content without explicit written permission.</li>
              <li>By submitting reviews, photos, or other content to the platform, you grant Tiffin Tales a non-exclusive, royalty-free license to use, display, and promote that content.</li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">8</span>
              Limitation of Liability
            </h2>
            <p className="mb-3">
              To the maximum extent permitted by applicable Indian law, Tiffin Tales shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the platform, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>Loss of data, revenue, or profits.</li>
              <li>Food quality issues beyond our verification standards.</li>
              <li>Delivery delays caused by factors beyond our reasonable control.</li>
              <li>Any illness or adverse reaction from food consumed through the platform.</li>
            </ul>
            <p className="mt-3">Our aggregate liability shall not exceed the amount paid by you for the specific order giving rise to the claim.</p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">9</span>
              Privacy
            </h2>
            <p>
              Your use of the platform is also governed by our{" "}
              <button onClick={() => navigate("/privacy")} className="text-orange-500 hover:underline font-medium">Privacy Policy</button>,
              which is incorporated into these Terms by reference. By using Tiffin Tales, you consent to the collection and use of your information as described in that policy.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">10</span>
              Governing Law &amp; Dispute Resolution
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>These Terms shall be governed by the laws of India, particularly the Information Technology Act, 2000, and applicable consumer protection laws.</li>
              <li>Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in <strong>Mathura, Uttar Pradesh, India</strong>.</li>
              <li>We encourage you to first contact us to resolve any disputes informally before pursuing legal remedies.</li>
            </ul>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">11</span>
              Changes to These Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. When we do, we will update the "Last updated" date at the top of this page. Material changes will be communicated via email or a prominent notice on our website. Continued use of the platform after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* 12 — Contact */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">12</span>
              Contact Us
            </h2>
            <p className="mb-4">If you have any questions or concerns about these Terms &amp; Conditions, please contact us:</p>
            <div className="bg-orange-50 rounded-2xl p-6 space-y-2">
              <p className="font-bold text-zinc-800 text-lg">Tiffin Tales</p>
              <p className="text-zinc-600">📍 Mathura, Uttar Pradesh, India — 281001</p>
              <p className="text-zinc-600">
                📧{" "}
                <a href="mailto:support@tiffintalesindia.me" className="text-orange-500 hover:underline">
                  support@tiffintalesindia.me
                </a>
              </p>
              <p className="text-zinc-600">🌐 <a href="https://tiffintalesindia.me" className="text-orange-500 hover:underline">tiffintalesindia.me</a></p>
            </div>
          </section>

          {/* Back CTA */}
          <div className="text-center pt-6 border-t border-zinc-100">
            <p className="text-sm text-zinc-400 mb-4">Last updated: July 22, 2025 | Version 1.0</p>
            <button
              onClick={() => navigate("/")}
              className="inline-block px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
