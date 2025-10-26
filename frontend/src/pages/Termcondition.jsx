import React from "react";

import TopNav from "../components/TopNav";
const TermsAndConditions = () => {
  return (
    <>
    <TopNav />
    <div className="bg-white text-zinc-800 px-6 py-16 sm:px-12 md:px-24 lg:px-40">
     

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-6 text-center">
          Terms & Conditions
        </h1>

        <p className="mb-6 text-base text-center">
          Welcome to <span className="font-semibold text-orange-600">Tiffin Tales</span>. These Terms and Conditions govern your use of our website and food delivery service. By accessing or using our platform, you agree to be bound by these terms.
        </p>

        <div className="space-y-6 text-sm sm:text-base">
          <div>
            <h2 className="text-lg font-semibold text-orange-500">1. Registration</h2>
            <p>
              You must provide accurate and complete information during sign-up. You are responsible for maintaining the confidentiality of your login credentials.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-orange-500">2. Orders & Delivery</h2>
            <p>
              All orders are subject to availability. Delivery times may vary depending on location and demand. We strive to deliver fresh, homemade meals on time.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-orange-500">3. Pricing & Payments</h2>
            <p>
              Prices for meals are subject to change without notice. Payment is required before delivery through our supported payment options.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-orange-500">4. Cancellations & Refunds</h2>
            <p>
              Orders can be canceled within 10 minutes of placing them. Refunds are only applicable in case of failed deliveries or incorrect orders.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-orange-500">5. User Conduct</h2>
            <p>
              You agree not to misuse the platform. Any form of abuse, fraudulent activity, or policy violations may lead to account suspension.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-orange-500">6. Privacy</h2>
            <p>
              Your data is safe with us. Please review our Privacy Policy to understand how we collect and use your information.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-orange-500">7. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the site after changes indicates your acceptance of the revised terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-orange-500">8. Contact Us</h2>
            <p>
              If you have any questions or concerns about these terms, feel free to contact us via our Help & Support section.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500">Last updated: July 22, 2025</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default TermsAndConditions;
