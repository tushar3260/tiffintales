import React, { useEffect, useState } from "react";
import girlPizzaImg from "./girlspizza.png";

function Topnav() {
  const [location, setLocation] = useState("");
  const [addressInput, setAddressInput] = useState("");

  // Fetch saved user address from backend on load
  useEffect(() => {
    fetch("/api/user/address")
      .then((res) => res.json())
      .then((data) => setLocation(data.address || ""))
      .catch(() => setLocation(""));
  }, []);

  const handleFindFood = (e) => {
    e.preventDefault();
    if (addressInput.trim()) {
      alert("Searching food near: " + addressInput);
      setLocation(addressInput);
    } else {
      alert("Please enter your address");
    }
  };

  return (
    <div className="font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-orange-500 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="logo" className="w-8" />
          <span className="text-orange-500 font-bold text-lg">food</span>
          <span className="text-yellow-500 font-bold text-lg">wagon</span>
        </div>
        <div className="text-sm text-gray-600">
          Deliver to: <span className="font-semibold text-black">Current Location <span className="text-gray-700">{location || "Loading..."}</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm border border-gray-300 px-4 py-1 rounded-full text-gray-600 hover:text-black hover:border-black">Add Location</button>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-sm text-white px-5 py-1.5 rounded-full">Login</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#fff7ed] py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between relative">
        <div className="max-w-xl z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">Are you starving?</h1>
          <p className="text-gray-600 mb-6">Within a few clicks, find meals that are accessible near you</p>

          <div className="relative">
            <div className="bg-white rounded-lg p-4 w-full z-10 relative shadow-[0px_10px_30px_rgba(255,115,0,0.25)]">
              <div className="flex items-center gap-4 mb-3">
                <button className="bg-orange-100 text-orange-500 px-4 py-1.5 rounded-full font-medium text-sm">🍔 Delivery</button>
                <button className="text-gray-500 px-4 py-1.5 rounded-full font-medium text-sm">🥡 Pickup</button>
              </div>
              <form className="flex" onSubmit={handleFindFood}>
                <input
                  type="text"
                  placeholder="Enter Your Address"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="flex-grow bg-gray-100 px-4 py-2 rounded-l-md outline-none text-sm"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-medium rounded-r-md"
                >
                  🔍 Find Food
                </button>
              </form>
            </div>
            <div className="absolute top-full left-0 right-0 h-3 bg-gradient-to-b from-orange-100 to-transparent rounded-b-lg shadow-xl blur-sm"></div>
          </div>
        </div>

        {/* <div className="mt-10 md:mt-0 z-10">
          <img
            src={girlPizzaImg}
            alt="Girl Eating Pizza"
            className="w-80 md:w-96"
          />
        </div> */}
      </div>

      {/* Offers Section */}
      <div className="bg-white py-10 px-6 md:px-20 border-t-2 border-blue-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { img: "/img1.jpg", off: "15%", days: 6 },
            { img: "/img2.jpg", off: "10%", days: 6 },
            { img: "/img3.jpg", off: "25%", days: 7 },
            { img: "/img4.jpg", off: "20%", days: 8 },
          ].map((item, i) => (
            <div key={i} className="bg-white shadow rounded overflow-hidden">
              <div className="relative">
                <img src={item.img} alt="Food" className="w-full h-44 object-cover" />
                <span className="absolute bottom-2 left-2 bg-orange-400 text-white text-xs px-2 py-1 rounded font-semibold">
                  {item.off} Off
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold">Greys Vage</h3>
                <p className="text-xs text-orange-500 font-semibold mt-1">{item.days} Days Remaining</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topnav;