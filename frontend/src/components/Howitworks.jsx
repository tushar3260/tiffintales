import React from "react";
import { MapPin, Utensils, CreditCard, Donut } from "lucide-react";

const steps = [
  {
    title: "Select location",
    desc: "Choose the location where your food will be delivered.",
    icon: <MapPin size={40} className="text-white" />,
    bg: "bg-yellow-500",
  },
  {
    title: "Choose order",
    desc: "Check over hundreds of menus to pick your favorite food.",
    icon: <Utensils size={40} className="text-white" />,
    bg: "bg-yellow-500",
  },
  {
    title: "Pay advanced",
    desc: "It's quick, safe, and simple. Select several methods of payment.",
    icon: <CreditCard size={40} className="text-white" />,
    bg: "bg-yellow-500",
  },
  {
    title: "Enjoy meals",
    desc: "Food is made and delivered directly to your home.",
    icon: <Donut size={40} className="text-white" />,
    bg: "bg-yellow-500",
  },
];

function Howitworks() {
  return (
    <section className="bg-gradient-to-b from-yellow-100 via-orange-100 to-yellow-50 py-16 text-center">
      <h2 className="text-3xl font-bold text-orange-600 mb-12">
        How does it work
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto px-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`p-4 rounded-full shadow-lg ${step.bg}`}>
              {step.icon}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
            <p className="text-gray-600 mt-2 max-w-xs">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Howitworks;
