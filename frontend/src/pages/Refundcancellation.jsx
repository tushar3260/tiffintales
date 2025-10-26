import React from "react";
import TopNav from "../components/TopNav";

function RefundAndCancellation() {
  return (
    <>
    <TopNav />
    <div className="bg-white text-zinc-800 px-6 py-16 sm:px-12 md:px-24 lg:px-40 min-h-screen">
     

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-8 text-center">
        Refund & Cancellation Policy
      </h1>

      {/* Content */}
      <div className="max-w-5xl mx-auto space-y-6 text-base leading-relaxed">
        <p>
          At <span className="font-semibold text-orange-600">Tiffin Tales</span>, customer satisfaction is our top priority.
          We aim to provide fresh, hygienic, and timely meals. However, in case of unavoidable issues, our refund and cancellation policies are as follows:
        </p>

        <div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">1. Cancellation Policy</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Cancellations must be made at least <strong> 30 minutes before the scheduled delivery</strong>.</li>
            <li>Cancellations made after the preparation starts will not be eligible for a refund.</li>
            <li>You can cancel by contacting us via email or phone.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">2. Refund Policy</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Refunds are issued only if the order is canceled within the allowed time frame.</li>
            <li>If there's a mistake from our side (e.g., wrong or missing item), we will either <strong>replace the meal or issue a full/partial refund</strong>.</li>
            <li>Refunds will be processed within <strong>5–7 working days</strong> to the original payment method.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">3. Contact for Refunds</h2>
          <p>
            To request a refund, please contact our support team at:
            <br />
            <strong>Email:</strong> support@tiffintales.com
            <br />
            <strong>Phone:</strong> +91-XXXXXXXXXX
          </p>
        </div>

        <p className="italic text-sm text-zinc-600">
          Note: Tiffin Tales reserves the right to update this policy without prior notice. We recommend reviewing it periodically.
        </p>
      </div>
    </div>
    </>
  );
}

export default RefundAndCancellation;
