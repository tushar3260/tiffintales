import React from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

function RefundAndCancellation() {
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
              Refund &amp; Cancellation Policy
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
              At <strong className="text-orange-600">Tiffin Tales</strong>, customer satisfaction is our top priority. We connect you with verified home chefs who prepare fresh, high-quality meals. In the rare event that something goes wrong, this policy outlines how cancellations and refunds work.
            </p>
          </div>

          {/* 1 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">1</span>
              Order Cancellation Policy
            </h2>
            <p className="mb-3">You may cancel an order under the following conditions:</p>
            <div className="overflow-x-auto rounded-xl border border-zinc-200 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700">Cancellation Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700">Refund Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <td className="py-3 px-4 font-medium text-zinc-800">More than 30 min before delivery</td>
                    <td className="py-3 px-4 text-green-700 font-medium">✅ Full Refund</td>
                  </tr>
                  <tr className="bg-zinc-50">
                    <td className="py-3 px-4 font-medium text-zinc-800">Within 30 min (before preparation starts)</td>
                    <td className="py-3 px-4 text-yellow-700 font-medium">⚠️ Partial Refund (case-by-case)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-zinc-800">After preparation has started</td>
                    <td className="py-3 px-4 text-red-700 font-medium">❌ No Refund</td>
                  </tr>
                  <tr className="bg-zinc-50">
                    <td className="py-3 px-4 font-medium text-zinc-800">After delivery</td>
                    <td className="py-3 px-4 text-red-700 font-medium">❌ No Refund (except in case of our error)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>To cancel an order, go to your <strong>My Orders</strong> section in the app or contact us directly via WhatsApp/email.</li>
              <li>Cancellations made after the preparation has started cannot be accommodated as fresh ingredients have already been used.</li>
              <li>We reserve the right to cancel any order in cases of fraud, unavailability, or technical errors. In such cases, a full refund will be issued automatically.</li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">2</span>
              Refund Policy
            </h2>
            <p className="mb-3">Refunds will be issued in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-4">
              <li><strong>Order canceled by you within the eligible window:</strong> Full refund to the original payment method.</li>
              <li><strong>Order canceled by Tiffin Tales or the chef:</strong> Full refund automatically issued within 24 hours.</li>
              <li><strong>Incorrect or incomplete order:</strong> If you receive a meal with missing or wrong items due to our error, you are eligible for a partial or full refund, or a replacement. Please report within <strong>2 hours of delivery</strong> with a photo.</li>
              <li><strong>Food quality issue:</strong> If your meal arrives spoiled or clearly unsafe to consume, we will investigate and issue a refund or replacement at our discretion. Report within <strong>1 hour of delivery</strong>.</li>
              <li><strong>Failed delivery:</strong> If your order is never delivered and no delivery attempt was made, you will receive a full refund.</li>
            </ul>
            <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4">
              <p className="font-semibold text-zinc-800 mb-2">⏱ Refund Processing Time</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-600 text-sm">
                <li><strong>UPI / Net Banking:</strong> 1–3 working days</li>
                <li><strong>Credit / Debit Card:</strong> 5–7 working days</li>
                <li><strong>Wallet / Razorpay:</strong> 2–5 working days</li>
                <li><strong>Cash on Delivery:</strong> Refund via bank transfer within 7 working days (NEFT/IMPS)</li>
              </ul>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">3</span>
              Subscription Cancellation
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>You may pause or cancel your subscription at any time from your <strong>Dashboard → Subscriptions</strong>.</li>
              <li>Cancellation of an active subscription will stop future renewals. Remaining meal credits for the current billing period will remain usable until the end of the period.</li>
              <li>Refunds for unused subscription days are available <strong>only within 3 days of the subscription start date</strong>, provided fewer than 3 meals have been delivered.</li>
              <li>Subscription payments that have already been processed are generally non-refundable after the 3-day window, except in cases of technical failure or billing errors.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">4</span>
              Non-Refundable Situations
            </h2>
            <p className="mb-3">Refunds will <strong>not</strong> be provided in the following cases:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>If the delivery address provided was incorrect or inaccessible, resulting in a failed delivery.</li>
              <li>If the customer was unavailable to receive the delivery after the delivery partner made reasonable attempts to contact them.</li>
              <li>Dissatisfaction with taste alone (subjective preferences) — we do encourage you to share feedback to help chefs improve.</li>
              <li>Refund requests made more than 24 hours after delivery.</li>
              <li>Orders placed using fraudulent accounts, stolen payment methods, or promotional abuse.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">5</span>
              How to Request a Refund
            </h2>
            <p className="mb-3">To initiate a refund or cancellation, contact us through any of the following methods within the eligible time frame:</p>
            <div className="bg-orange-50 rounded-2xl p-6 space-y-3">
              <p className="font-bold text-zinc-800 text-lg">Tiffin Tales Support</p>
              <p className="text-zinc-600">
                📧 <strong>Email:</strong>{" "}
                <a href="mailto:support@tiffintalesindia.me" className="text-orange-500 hover:underline">
                  support@tiffintalesindia.me
                </a>
              </p>
              <p className="text-zinc-600">
                📱 <strong>Phone / WhatsApp:</strong>{" "}
                <a href="tel:+919109999999" className="text-orange-500 hover:underline">
                  +91-9109999999
                </a>
              </p>
              <p className="text-zinc-600">🕐 <strong>Business Hours:</strong> Monday–Saturday, 9 AM – 7 PM IST</p>
              <p className="text-zinc-600">📍 Mathura, Uttar Pradesh, India</p>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              When contacting us, please provide your order ID, the issue description, and (where applicable) photos of the problem. This helps us resolve your request faster.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">6</span>
              Changes to This Policy
            </h2>
            <p>
              Tiffin Tales reserves the right to modify this Refund &amp; Cancellation Policy at any time. Any changes will be reflected with an updated date on this page. We recommend reviewing this policy periodically to stay informed.
            </p>
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
}

export default RefundAndCancellation;
