import React from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
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
              Privacy Policy
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
              At <strong className="text-orange-600">Tiffin Tales</strong> ("we", "our", or "us"), we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website{" "}
              <a href="https://tiffintalesindia.me" className="text-orange-600 hover:underline">tiffintalesindia.me</a>{" "}
              or use our food delivery services. Please read this policy carefully.
            </p>
          </div>

          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">1</span>
              Information We Collect
            </h2>
            <p className="mb-3">We collect information that you provide directly to us, information we collect automatically, and information from third parties.</p>
            <h3 className="font-semibold text-zinc-800 mb-2">A. Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-4">
              <li><strong>Account Registration:</strong> Full name, email address, phone number, and password when you create an account.</li>
              <li><strong>Profile Information:</strong> Profile photo (optional), delivery address, and saved location data.</li>
              <li><strong>Orders & Transactions:</strong> Meal preferences, order history, delivery instructions, and payment-related information (processed securely through Razorpay — we do not store card/UPI details).</li>
              <li><strong>Communications:</strong> Any messages, feedback, reviews, or support requests you send us via email, WhatsApp, or our in-app chat feature.</li>
              <li><strong>Chef Registration:</strong> If you register as a home chef, we collect your cooking details, identity documents (for verification), and bank account details for payments.</li>
            </ul>
            <h3 className="font-semibold text-zinc-800 mb-2">B. Information Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-4">
              <li><strong>Usage Data:</strong> Pages visited, time spent, links clicked, search queries entered, and features used.</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers, and screen resolution.</li>
              <li><strong>Location Data:</strong> Approximate location based on IP address; precise location only if you grant permission via browser geolocation.</li>
              <li><strong>Cookies & Tracking Technologies:</strong> See Section 6 for detailed information about our cookie usage.</li>
            </ul>
            <h3 className="font-semibold text-zinc-800 mb-2">C. Information From Third Parties</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li><strong>Google Sign-In:</strong> If you sign in using Google OAuth, we receive your name, email address, and profile picture from Google, as permitted by your Google account settings.</li>
              <li><strong>Razorpay:</strong> Our payment processor may share transaction status and limited payment metadata with us.</li>
            </ul>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">2</span>
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>To create and manage your account on our platform.</li>
              <li>To process and deliver your food orders, including communication with home chefs.</li>
              <li>To send order confirmations, delivery updates, and transaction receipts via email or SMS.</li>
              <li>To personalize your experience and show you relevant meals and chefs based on your location and preferences.</li>
              <li>To respond to your customer support inquiries and resolve disputes.</li>
              <li>To send you promotional offers, newsletters, or subscription renewal reminders — only if you have opted in.</li>
              <li>To analyze usage patterns and improve the performance, features, and security of our platform.</li>
              <li>To comply with legal obligations under Indian law, including the Information Technology Act, 2000 and India's Personal Data Protection Bill (PDPB).</li>
              <li>To detect fraud, prevent abuse, and ensure the security of our platform and users.</li>
            </ul>
          </section>

          {/* 3. Sharing of Information */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">3</span>
              Sharing of Your Information
            </h2>
            <p className="mb-3">We do <strong>not sell, rent, or trade</strong> your personal information to third parties for their marketing purposes. We may share your information only in the following limited circumstances:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li><strong>Home Chefs:</strong> We share your delivery address and order details with the relevant home chef who prepares and delivers your meal.</li>
              <li><strong>Payment Processor (Razorpay):</strong> Payment information is handled entirely by Razorpay. We share transaction details necessary to complete your payment. Razorpay's privacy policy applies to their handling of your payment data.</li>
              <li><strong>Google (OAuth):</strong> If you use Google Sign-In, Google receives information about your sign-in activity as governed by Google's Privacy Policy.</li>
              <li><strong>Analytics (Cloudflare):</strong> We use Cloudflare for website security and analytics. Cloudflare may collect anonymized traffic data to protect our site.</li>
              <li><strong>Legal Compliance:</strong> We may disclose your information if required by law, court order, or government authority in India.</li>
              <li><strong>Business Transfer:</strong> If Tiffin Tales is acquired or merges with another company, your information may be transferred as part of that transaction.</li>
            </ul>
          </section>

          {/* 4. Google AdSense & Advertising */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">4</span>
              Google AdSense & Advertising
            </h2>
            <p className="mb-3">
              We use <strong>Google AdSense</strong> to display advertisements on our website. Google AdSense uses cookies and similar tracking technologies to serve ads based on your prior visits to our website and other websites on the internet.
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-3">
              <li>Google may use the DoubleClick cookie and other cookies to serve ads based on a user's prior visits.</li>
              <li>You can opt out of personalized advertising by visiting{" "}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Google Ads Settings</a>.
              </li>
              <li>You can also opt out via the{" "}
                <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Network Advertising Initiative opt-out page</a>.
              </li>
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites.</li>
            </ul>
            <p>
              For more information about how Google uses data from partner sites, visit:{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                How Google uses information from sites that use our services
              </a>.
            </p>
          </section>

          {/* 5. Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">5</span>
              Cookies & Tracking Technologies
            </h2>
            <p className="mb-3">We use cookies and similar technologies to enhance your experience. Here is a breakdown of the cookies we use:</p>
            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full text-sm">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700">Cookie Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700">Purpose</th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700">Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <td className="py-3 px-4 font-medium text-zinc-800">Essential</td>
                    <td className="py-3 px-4 text-zinc-600">Authentication, session management, shopping cart</td>
                    <td className="py-3 px-4 text-zinc-500">Tiffin Tales</td>
                  </tr>
                  <tr className="bg-zinc-50">
                    <td className="py-3 px-4 font-medium text-zinc-800">Analytics</td>
                    <td className="py-3 px-4 text-zinc-600">Anonymous usage statistics, traffic analysis</td>
                    <td className="py-3 px-4 text-zinc-500">Cloudflare</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-zinc-800">Advertising</td>
                    <td className="py-3 px-4 text-zinc-600">Personalized ads, ad performance measurement</td>
                    <td className="py-3 px-4 text-zinc-500">Google AdSense / DoubleClick</td>
                  </tr>
                  <tr className="bg-zinc-50">
                    <td className="py-3 px-4 font-medium text-zinc-800">OAuth</td>
                    <td className="py-3 px-4 text-zinc-600">Google Sign-In authentication</td>
                    <td className="py-3 px-4 text-zinc-500">Google</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              You can control cookies through your browser settings. However, disabling certain cookies may affect the functionality of our website.
            </p>
          </section>

          {/* 6. Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">6</span>
              Data Security
            </h2>
            <p className="mb-3">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>All data transmission is encrypted using HTTPS/TLS (SSL certificate active).</li>
              <li>Passwords are hashed and salted — never stored in plain text.</li>
              <li>Payment data is handled entirely by Razorpay — we never store card numbers or UPI PINs.</li>
              <li>Access to user data is restricted to authorized Tiffin Tales team members only.</li>
              <li>We conduct regular security reviews of our platform.</li>
            </ul>
            <p className="mt-3">
              Despite these measures, no internet transmission is 100% secure. If you suspect unauthorized access to your account, please contact us immediately at{" "}
              <a href="mailto:support@tiffintalesindia.me" className="text-orange-500 hover:underline">
                support@tiffintalesindia.me
              </a>.
            </p>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">7</span>
              Data Retention
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li><strong>Account data:</strong> Retained for as long as your account is active. If you request account deletion, we delete your personal data within 30 days.</li>
              <li><strong>Order history:</strong> Retained for 3 years for legal and financial compliance purposes.</li>
              <li><strong>Payment records:</strong> Retained for 7 years as required under Indian financial regulations.</li>
              <li><strong>Communications:</strong> Support messages are retained for 1 year.</li>
            </ul>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">8</span>
              Your Rights (Under Indian PDPB & IT Act)
            </h2>
            <p className="mb-3">As a user of our platform, you have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Right to Deletion:</strong> Request deletion of your personal data ("Right to be Forgotten"), subject to legal retention requirements.</li>
              <li><strong>Right to Data Portability:</strong> Request your data in a structured, machine-readable format.</li>
              <li><strong>Right to Object:</strong> Object to processing of your data for marketing purposes.</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time for data processed on the basis of consent.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:privacy@tiffintalesindia.me" className="text-orange-500 hover:underline">
                privacy@tiffintalesindia.me
              </a>{" "}
              with the subject line "Data Rights Request". We will respond within 30 days.
            </p>
          </section>

          {/* 9. Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">9</span>
              Children's Privacy
            </h2>
            <p>
              Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete it immediately. If you believe a child has provided us with their data, please contact us at{" "}
              <a href="mailto:support@tiffintalesindia.me" className="text-orange-500 hover:underline">
                support@tiffintalesindia.me
              </a>.
            </p>
          </section>

          {/* 10. Changes */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">10</span>
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page and notify you via email or a prominent notice on our website. Continued use of our platform after changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* 11. Contact */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black">11</span>
              Contact Us
            </h2>
            <p className="mb-4">If you have any questions, concerns, or requests related to this Privacy Policy, you may reach us at:</p>
            <div className="bg-orange-50 rounded-2xl p-6 space-y-2">
              <p className="font-bold text-zinc-800 text-lg">Tiffin Tales</p>
              <p className="text-zinc-600">📍 Mathura, Uttar Pradesh, India — 281001</p>
              <p className="text-zinc-600">
                📧{" "}
                <a href="mailto:privacy@tiffintalesindia.me" className="text-orange-500 hover:underline">
                  privacy@tiffintalesindia.me
                </a>
              </p>
              <p className="text-zinc-600">
                📧 General:{" "}
                <a href="mailto:support@tiffintalesindia.me" className="text-orange-500 hover:underline">
                  support@tiffintalesindia.me
                </a>
              </p>
              <p className="text-zinc-600">🌐 <a href="https://tiffintalesindia.me" className="text-orange-500 hover:underline">tiffintalesindia.me</a></p>
            </div>
          </section>

          {/* Go back CTA */}
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

export default PrivacyPolicy;
