import React from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

const Disclaimer = () => {
  const navigate = useNavigate();

  return (
    <>
      <TopNav />
      <div className="bg-white text-zinc-800 min-h-screen">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100 py-14 px-6 pt-24">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full uppercase tracking-widest mb-4">Legal</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-3">Disclaimer</h1>
            <p className="text-zinc-500">Last updated: July 22, 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-14 space-y-8 text-base leading-relaxed text-zinc-700">

          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-xl p-5">
            <p>
              The information provided by <strong className="text-orange-600">Tiffin Tales</strong> on{" "}
              <a href="https://tiffintalesindia.me" className="text-orange-500 hover:underline">tiffintalesindia.me</a>{" "}
              is for general informational purposes only. All content is provided in good faith, and while we strive for accuracy, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, or completeness of any information on the site.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">1. Food & Nutrition Disclaimer</h2>
            <p className="mb-3">
              All meals listed on Tiffin Tales are prepared by independent home chefs ("Chefs") who are registered on our platform. Tiffin Tales does not prepare, cook, or directly handle any food items. The nutritional information provided (if any) is approximate and for informational purposes only.
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>Calorie and nutrition counts are estimates and may vary based on ingredient substitutions and chef preparation methods.</li>
              <li>Tiffin Tales does not guarantee that any meal is free from specific allergens. Customers with severe food allergies must communicate directly with their assigned chef.</li>
              <li>The content on this site is not intended as nutritional or medical advice. Always consult a qualified healthcare professional for dietary recommendations specific to your health condition.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">2. Third-Party Content & Links</h2>
            <p>
              Our website may contain links to external websites and content. Tiffin Tales does not control or endorse the content of third-party websites and is not responsible for any content, products, or services provided by them. The inclusion of any link does not imply our recommendation or endorsement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">3. Platform Liability</h2>
            <p className="mb-3">
              Tiffin Tales acts as a marketplace connecting customers with independent home chefs. We are not the food manufacturer, packager, or distributor. Accordingly:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600">
              <li>We are not liable for any illness, injury, or adverse reaction caused by food consumed from our platform, beyond the remedies provided in our Refund & Cancellation Policy.</li>
              <li>We make no warranties regarding food quality, taste, or presentation beyond our verification standards.</li>
              <li>Delivery timelines are estimates and may be affected by traffic, weather, or operational factors beyond our control.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">4. Google AdSense Advertising Disclaimer</h2>
            <p>
              This website uses Google AdSense to display advertisements. These ads may be personalized based on your browsing history and interests. Tiffin Tales is not responsible for the content of advertisements displayed on this site. Third-party advertisers may collect data as outlined in our{" "}
              <button onClick={() => navigate("/privacy")} className="text-orange-500 hover:underline font-medium">Privacy Policy</button>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">5. Blog Content Disclaimer</h2>
            <p>
              Articles and guides published on the Tiffin Tales blog represent the opinions and research of our team and are intended for informational purposes only. They do not constitute professional nutritional, medical, legal, or financial advice. Reader discretion is advised.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">6. Changes to This Disclaimer</h2>
            <p>We reserve the right to update this Disclaimer at any time. Changes will be reflected with an updated date at the top of this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">7. Contact</h2>
            <div className="bg-orange-50 rounded-2xl p-5">
              <p>For questions about this Disclaimer, contact:</p>
              <p className="mt-2 font-semibold">Tiffin Tales — Mathura, Uttar Pradesh, India</p>
              <a href="mailto:support@tiffintalesindia.me" className="text-orange-500 hover:underline">support@tiffintalesindia.me</a>
            </div>
          </section>

          <div className="text-center pt-6 border-t border-zinc-100">
            <button onClick={() => navigate("/")} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Disclaimer;
