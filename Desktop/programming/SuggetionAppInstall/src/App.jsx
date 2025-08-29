import React from "react";

export default function FoodAppPromo() {
  return (
    <div className="w-full bg-gradient-to-b from-orange-50 to-orange-100 text-gray-900">
      {/* --- Feature Highlights --- */}
      <div className="mx-auto mb-16 flex max-w-4xl flex-col gap-6 rounded-2xl bg-white p-8 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <Feature icon="%" title="Daily" subtitle="Discounts" />
        <Divider />
        <Feature icon="📍" title="Live" subtitle="Tracing" />
        <Divider />
        <Feature icon="⏱️" title="Quick" subtitle="Delivery" />
      </div>

      {/* --- App Install Section --- */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-12 px-6 pb-16 md:flex-row">
        <div className="flex items-end gap-6">
          <img src="https://media.istockphoto.com/id/1224965655/photo/young-woman-orders-food-for-lunch-online-using-a-smartphone.webp?a=1&b=1&s=612x612&w=0&k=20&c=fZHfeJZcKiaXAn8NABo2oz4xNpIKzcEdkR9ZPoYUbVw=" alt="Order screen" className="w-40 rounded-xl shadow-md md:w-48 lg:w-56" />
          <img src="https://media.istockphoto.com/id/1300476665/photo/high-angle-view-asian-chinese-womans-hand-on-mobile-app-for-online-food-delivery-during.webp?a=1&b=1&s=612x612&w=0&k=20&c=VXXr6i-b1x2C6Dyy8pvajVAV3t6-nXDFfLZZGB0r7TE=" alt="Browse screen" className="w-44 rounded-xl shadow-md md:w-52 lg:w-60" />
        </div>

        <div className="text-center md:text-left md:max-w-md lg:max-w-lg">
          <h2 className="mb-4 text-4xl font-extrabold text-orange-600">Install the app</h2>
          <p className="mb-6 leading-relaxed text-gray-700">
            It's never been easier to order food. Discover the finest deals and dive into a world of deliciousness.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <a href="https://play.google.com/store/apps/" target="_blank" rel="noopener noreferrer">
              <img src="data:image/png;base64,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" alt="Get it on Google Play" className="h-12" />
            </a>
            <a href="https://developer.apple.com/app-store/search/" >
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_HPB6gEgVCXUwaNqSvxi5caOQ3ud_4eqasA&s" alt="Download on the App Store" className="h-12" />
            </a>
          </div>
        </div>
      </div>

      {/* --- Search by Food Category --- */}
      <div className="bg-[#FFF8EF] py-14 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Search by Food</h2>
            <div className="flex items-center gap-2 text-orange-500 font-semibold">
              <a href="#" className="hover:underline">View All</a>
              <button className="h-10 w-10 rounded-full bg-orange-400 text-white shadow-lg">❮</button>
              <button className="h-10 w-10 rounded-full bg-orange-400 text-white shadow-lg">❯</button>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-2">
            {foodItems.map((item) => (
              <div key={item.label} className="flex flex-col items-center min-w-[80px]">
                <img
                  src={item.image}
                  alt={item.label}
                  className="h-24 w-24 rounded-full object-cover shadow-md"
                />
                <p className="mt-2 font-semibold text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/*****************
 * Helper Pieces *
 *****************/
function Feature({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-3xl text-orange-600">{icon}</span>
      <div className="leading-tight">
        <p className="font-semibold text-orange-600">{title}</p>
        <p className="font-semibold text-orange-600">{subtitle}</p>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="hidden h-10 w-px bg-gray-300 sm:block" />;
}

const foodItems = [
  {
    label: "Pizza",
    image: "https://media.istockphoto.com/id/187248625/photo/pepperoni-pizza.webp?a=1&b=1&s=612x612&w=0&k=20&c=clncU414Y_vfH-OoUqiwy5AnZRwBpeSehVqJkD9SvKU=",
  },
  {
    label: "Burger",
    image: "https://media.istockphoto.com/id/998309062/photo/burger-with-beef-and-cheese.webp?a=1&b=1&s=612x612&w=0&k=20&c=hthCHhBsUotyv4SCP8MdltTNv1bT6g5R9NIB1fufva0=",
  },
  {
    label: "Noodles",
    image: "https://plus.unsplash.com/premium_photo-1694670234085-4f38b261ce5b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bm9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    label: "Sub-sandiwich",
    image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNhbmR3aWNofGVufDB8fDB8fHww",
  },
  {
    label: "Chowmein",
    image: "https://media.istockphoto.com/id/2204824483/photo/a-vibrant-plate-of-stir-fried-noodles-with-vegetables-topped-with-fresh-cilantro-rests-on-a.webp?a=1&b=1&s=612x612&w=0&k=20&c=TvaUiYud13QLBKBPJCeJrBIVEFth0c7avT282As_SZo=",
  },
  {
    label: "Steak",
    image: "https://images.unsplash.com/photo-1565299715199-866c917206bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHN0ZWFrfGVufDB8fDB8fHww",
  },
];
