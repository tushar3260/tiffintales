import React from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <>
    <TopNav />
    <div className="bg-white text-zinc-800 px-6 py-16 sm:px-12 md:px-24 lg:px-40">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-orange-500">
          About Us
        </h1>

        <p className="text-lg mb-4">
          Welcome to{" "}
          <span className="font-semibold text-orange-600">Tiffin Tales</span> —
          your local homemade food delivery service dedicated to bringing you
          authentic, hygienic, and tasty meals straight from our kitchen to your
          doorstep.
        </p>

        <p className="text-md mb-4 leading-relaxed">
          Based in <span className="font-medium">Mathura</span>, we serve various
          areas like Vrindavan, Chaumhuna, GLA University, Barsana, and more.
          Whether you're a student missing home-cooked food, a working
          professional, or someone looking for clean and affordable meals — we’ve
          got you covered.
        </p>

        <p className="text-md mb-4 leading-relaxed">
          Our mission is to empower local home chefs, preserve traditional
          recipes, and provide a platform for fresh, nutritious food. We don’t
          just deliver meals — we deliver warmth, love, and a little piece of
          home.
        </p>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-orange-500">
            Why Choose Us?
          </h2>
          <ul className="list-disc list-inside space-y-2 text-base">
            <li>Fresh, homemade meals made daily</li>
            <li>Affordable prices with customizable plans</li>
            <li>Hygienic preparation with quality ingredients</li>
            <li>On-time delivery to your location</li>
            <li>Support local women and home chefs</li>
          </ul>
        </div>

        <div className="mt-10 text-center">
          <p className="text-xl font-semibold">
            Want to try our tiffin service?
          </p>
          <button
            onClick={() => navigate("/meals")}
            className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default AboutUs;
